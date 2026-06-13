use std::{cell::RefCell, f64::consts::TAU, rc::Rc};

use js_sys::{Array, Math, Object, Reflect};
use wasm_bindgen::{JsCast, prelude::*};
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement, Window, window};

#[wasm_bindgen]
pub struct CanvasApp {
    state: Rc<RefCell<RenderState>>,
}

struct RenderState {
    canvas: HtmlCanvasElement,
    context: CanvasRenderingContext2d,
    ref_id: Option<i32>,
    animation: Option<Closure<dyn FnMut()>>,
}

#[wasm_bindgen]
impl CanvasApp {
    pub fn handle_click(&self) -> Result<(), JsValue> {
        {
            let mut state = self.state.borrow_mut();
            resize_canvas(&mut state)?;
            clear_canvas(&mut state);
        }

        Ok(())
    }

    pub fn stop(&self) {
        stop_animation(&self.state);
    }
}

impl Drop for CanvasApp {
    fn drop(&mut self) {
        stop_animation(&self.state);
    }
}

#[wasm_bindgen]
pub struct CrankDrawerApp {
    state: Rc<RefCell<CrankDrawerState>>,
}

struct CrankDrawerState {
    crank_context: CanvasRenderingContext2d,
    trail_context: CanvasRenderingContext2d,
    canvas_width: f64,
    canvas_height: f64,
    center_x: f64,
    center_y: f64,
    lines: Vec<CrankLine>,
    before_x: f64,
    before_y: f64,
    clear_flag: bool,
    ref_id: Option<i32>,
    animation: Option<Closure<dyn FnMut()>>,
}

struct CrankLine {
    radius: f64,
    degree_step: f64,
    current_degree: f64,
}

#[wasm_bindgen]
impl CrankDrawerApp {
    pub fn reset(&self) -> Result<(), JsValue> {
        let mut state = self.state.borrow_mut();
        reset_crank_lines(&mut state)
    }

    pub fn lines_info(&self) -> Result<Array, JsValue> {
        let state = self.state.borrow();
        lines_to_js(&state.lines)
    }

    pub fn stop(&self) {
        stop_crank_animation(&self.state);
    }
}

impl Drop for CrankDrawerApp {
    fn drop(&mut self) {
        stop_crank_animation(&self.state);
    }
}

#[wasm_bindgen]
pub fn start(canvas: HtmlCanvasElement) -> Result<CanvasApp, JsValue> {
    console_error_panic_hook::set_once();

    let context = canvas
        .get_context("2d")?
        .ok_or_else(|| JsValue::from_str("2D context is not available"))?
        .dyn_into::<CanvasRenderingContext2d>()?;

    let state = Rc::new(RefCell::new(RenderState {
        canvas,
        context,
        ref_id: None,
        animation: None,
    }));

    render_frame(&state)?;

    let animation_state = state.clone();
    let animation = Closure::wrap(Box::new(move || {
        if let Err(error) = render_frame(&animation_state) {
            web_sys::console::error_1(&error);
            stop_animation(&animation_state);
            return;
        }

        if let Err(error) = queue_next_frame(&animation_state) {
            web_sys::console::error_1(&error);
            stop_animation(&animation_state);
        }
    }) as Box<dyn FnMut()>);

    state.borrow_mut().animation = Some(animation);
    queue_next_frame(&state)?;

    Ok(CanvasApp { state })
}

#[wasm_bindgen]
pub fn start_crank_drawer(
    crank_canvas: HtmlCanvasElement,
    trail_canvas: HtmlCanvasElement,
) -> Result<CrankDrawerApp, JsValue> {
    console_error_panic_hook::set_once();

    let crank_context = crank_canvas
        .get_context("2d")?
        .ok_or_else(|| JsValue::from_str("Crank canvas 2D context is not available"))?
        .dyn_into::<CanvasRenderingContext2d>()?;

    let trail_context = trail_canvas
        .get_context("2d")?
        .ok_or_else(|| JsValue::from_str("Trail canvas 2D context is not available"))?
        .dyn_into::<CanvasRenderingContext2d>()?;

    let canvas_width = crank_canvas.width().max(1) as f64;
    let canvas_height = crank_canvas.height().max(1) as f64;
    let (window_width, window_height) = window_size()?;

    let state = Rc::new(RefCell::new(CrankDrawerState {
        crank_context,
        trail_context,
        canvas_width,
        canvas_height,
        center_x: window_width * 0.5,
        center_y: window_height * 0.5,
        lines: Vec::new(),
        before_x: 0.0,
        before_y: 0.0,
        clear_flag: true,
        ref_id: None,
        animation: None,
    }));

    {
        let mut borrowed = state.borrow_mut();
        reset_crank_lines(&mut borrowed)?;
    }

    render_crank_drawer_frame(&state)?;

    let animation_state = state.clone();
    let animation = Closure::wrap(Box::new(move || {
        if let Err(error) = render_crank_drawer_frame(&animation_state) {
            web_sys::console::error_1(&error);
            stop_crank_animation(&animation_state);
            return;
        }

        if let Err(error) = queue_next_crank_frame(&animation_state) {
            web_sys::console::error_1(&error);
            stop_crank_animation(&animation_state);
        }
    }) as Box<dyn FnMut()>);

    state.borrow_mut().animation = Some(animation);
    queue_next_crank_frame(&state)?;

    Ok(CrankDrawerApp { state })
}

fn render_frame(state: &Rc<RefCell<RenderState>>) -> Result<(), JsValue> {
    let mut state = state.borrow_mut();
    resize_canvas(&mut state)?;
    clear_canvas(&mut state);

    Ok(())
}

fn resize_canvas(state: &mut RenderState) -> Result<(), JsValue> {
    let dpr = window_ref()?.device_pixel_ratio();
    let css_width = state.canvas.client_width().max(1) as f64;
    let css_height = state.canvas.client_height().max(1) as f64;

    let target_width = (css_width * dpr).round() as u32;
    let target_height = (css_height * dpr).round() as u32;

    if state.canvas.width() != target_width {
        state.canvas.set_width(target_width);
    }

    if state.canvas.height() != target_height {
        state.canvas.set_height(target_height);
    }

    state.context.set_transform(dpr, 0.0, 0.0, dpr, 0.0, 0.0)?;
    Ok(())
}

fn clear_canvas(state: &mut RenderState) {
    let width = state.canvas.width().max(1) as f64;
    let height = state.canvas.height().max(1) as f64;
    state.context.clear_rect(0.0, 0.0, width, height);
}


fn reset_crank_lines(state: &mut CrankDrawerState) -> Result<(), JsValue> {
    let (window_width, window_height) = window_size()?;
    state.center_x = window_width * 0.5;
    state.center_y = window_height * 0.5;

    let mut max_radius = (window_width.min(window_height) * 0.5 - 10.0).max(8.0);
    let number_of_lines = (Math::random() * 5.0).floor() as usize + 2;
    let mut lines = Vec::with_capacity(number_of_lines);

    for i in 0..number_of_lines {
        let side = if i >= number_of_lines - 1 {
            max_radius
        } else {
            (Math::random() * (max_radius - 5.0)) + 5.0
        };
        let degree = Math::random() * 4.5 + 0.5;
        let direction = if Math::random() >= 0.5 { 1.0 } else { -1.0 };

        lines.push(CrankLine {
            radius: side,
            degree_step: degree * direction,
            current_degree: 0.0,
        });

        max_radius = (max_radius - side).max(5.0);
    }

    state.lines = lines;
    state.before_x = state.center_x + max_radius;
    state.before_y = state.center_y;
    state.clear_flag = true;

    Ok(())
}

fn lines_to_js(lines: &[CrankLine]) -> Result<Array, JsValue> {
    let result = Array::new();

    for line in lines {
        let item = Object::new();
        Reflect::set(&item, &JsValue::from_str("radius"), &JsValue::from_f64(line.radius))?;
        Reflect::set(
            &item,
            &JsValue::from_str("degreeStep"),
            &JsValue::from_f64(line.degree_step),
        )?;
        Reflect::set(
            &item,
            &JsValue::from_str("currentDegree"),
            &JsValue::from_f64(line.current_degree),
        )?;
        result.push(&item);
    }

    Ok(result)
}

fn render_crank_drawer_frame(state: &Rc<RefCell<CrankDrawerState>>) -> Result<(), JsValue> {
    let mut state = state.borrow_mut();
    let center_x = state.center_x;
    let center_y = state.center_y;
    let canvas_width = state.canvas_width;
    let canvas_height = state.canvas_height;

    let (crank_context, lines) = {
        let state_ref = &mut *state;
        (&state_ref.crank_context, &mut state_ref.lines)
    };
    crank_context.clear_rect(0.0, 0.0, canvas_width, canvas_height);
    crank_context.set_stroke_style_str("black");
    crank_context.set_line_width(0.1);

    crank_context.begin_path();
    crank_context.move_to(0.0, center_y);
    crank_context.line_to(canvas_width, center_y);
    crank_context.stroke();

    crank_context.begin_path();
    crank_context.move_to(center_x, 0.0);
    crank_context.line_to(center_x, canvas_height);
    crank_context.stroke();

    crank_context.set_stroke_style_str("#ff0000");
    crank_context.set_line_width(0.5);
    crank_context.begin_path();
    crank_context.move_to(center_x, center_y);

    let mut parent_x = 0.0;
    let mut parent_y = 0.0;
    let mut parent_degree = 0.0;

    for (index, line) in lines.iter_mut().enumerate() {
        let (current_x, current_y) = if index == 0 {
            (
                line.radius * (line.current_degree.to_radians()).cos() + center_x,
                line.radius * (line.current_degree.to_radians()).sin() + center_y,
            )
        } else {
            let tmp_degree = parent_degree + line.current_degree;
            (
                line.radius * tmp_degree.to_radians().cos() + parent_x,
                line.radius * tmp_degree.to_radians().sin() + parent_y,
            )
        };

        crank_context.line_to(current_x, current_y);
        parent_degree = line.current_degree;
        line.current_degree += line.degree_step;
        parent_x = current_x;
        parent_y = current_y;
    }

    crank_context.stroke();

    crank_context.set_line_width(0.8);
    crank_context.begin_path();
    crank_context.arc(parent_x, parent_y, 10.0, 0.0, TAU)?;
    crank_context.stroke();

    if state.clear_flag {
        state
            .trail_context
            .clear_rect(0.0, 0.0, state.canvas_width, state.canvas_height);
    }

    if parent_y != state.before_y {
        state.trail_context.set_line_width(0.5);
        state.trail_context.begin_path();
        state.trail_context.move_to(state.before_x, state.before_y);
        state.trail_context.line_to(parent_x, parent_y);
        state.trail_context.stroke();
    }

    state.before_x = parent_x;
    state.before_y = parent_y;
    state.clear_flag = false;

    Ok(())
}

fn queue_next_crank_frame(state: &Rc<RefCell<CrankDrawerState>>) -> Result<(), JsValue> {
    let ref_id = {
        let borrowed = state.borrow();
        let callback = borrowed
            .animation
            .as_ref()
            .ok_or_else(|| JsValue::from_str("crank animation callback is missing"))?;

        window_ref()?.request_animation_frame(callback.as_ref().unchecked_ref())?
    };

    state.borrow_mut().ref_id = Some(ref_id);
    Ok(())
}

fn stop_crank_animation(state: &Rc<RefCell<CrankDrawerState>>) {
    let ref_id = state.borrow_mut().ref_id.take();

    if let Some(ref_id) = ref_id {
        if let Some(window) = window() {
            let _ = window.cancel_animation_frame(ref_id);
        }
    }

    state.borrow_mut().animation = None;
}

fn window_size() -> Result<(f64, f64), JsValue> {
    let window = window_ref()?;
    let width = window
        .inner_width()?
        .as_f64()
        .ok_or_else(|| JsValue::from_str("window.innerWidth is not a number"))?;
    let height = window
        .inner_height()?
        .as_f64()
        .ok_or_else(|| JsValue::from_str("window.innerHeight is not a number"))?;

    Ok((width, height))
}

fn queue_next_frame(state: &Rc<RefCell<RenderState>>) -> Result<(), JsValue> {
    let ref_id = {
        let borrowed = state.borrow();
        let callback = borrowed
            .animation
            .as_ref()
            .ok_or_else(|| JsValue::from_str("animation callback is missing"))?;

        window_ref()?.request_animation_frame(callback.as_ref().unchecked_ref())?
    };

    state.borrow_mut().ref_id = Some(ref_id);
    Ok(())
}

fn stop_animation(state: &Rc<RefCell<RenderState>>) {
    let ref_id = state.borrow_mut().ref_id.take();

    if let Some(ref_id) = ref_id {
        if let Some(window) = window() {
            let _ = window.cancel_animation_frame(ref_id);
        }
    }

    state.borrow_mut().animation = None;
}

fn window_ref() -> Result<Window, JsValue> {
    window().ok_or_else(|| JsValue::from_str("window is not available"))
}

