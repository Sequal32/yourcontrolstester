use std::{sync::{Arc, atomic::{AtomicBool, Ordering::SeqCst}}, thread::{sleep, spawn}, time::Duration};
use crossbeam_channel::{Receiver, Sender, unbounded};
use crate::{cmd::{UIEvents, Cmd}, gaugecommunicator::{GetResult}};

pub struct Ui {
    tx: Sender<UIEvents>,
    rx: Receiver<UIEvents>,
    stopped: Arc<AtomicBool>
}

impl Ui {
    pub fn run() -> Self {
        let (tx, rx) = unbounded::<UIEvents>();
        let (app_tx, app_rx) = unbounded::<UIEvents>();

        let stopped = Arc::new(AtomicBool::new(false));
        let stopped_clone = stopped.clone();

        spawn(move || {
            tauri::AppBuilder::new()
            .invoke_handler(move |_webview, arg| {
                match serde_json::from_str::<Cmd>(arg) {
                    Err(e) => {
                        Err(e.to_string())
                    }
                    Ok(command) => {
                        println!("{:?}", command);
                        match command {
                            Cmd::SetVar {..} | 
                            Cmd::WatchVar {..} => {
                                app_tx.send(UIEvents::Cmd(command));
                            }
                        }
                        Ok(())
                    }
                }
            })
            .setup(move |_webview, _| {

                let rx = rx.clone();
                let mut webview = _webview.as_mut();

                spawn(move || {
                    
                    loop {
                        match rx.try_recv() {
                            Ok(event) => match event {
                                UIEvents::VariableUpdate(data) => {

                                    tauri::event::emit(&mut webview, "update", Some(data)).ok();

                                }

                                _ => {}
                            }
                            Err(_) => {}
                        }
    
                        sleep(Duration::from_millis(10));
                    }
                    

                });

            })
            .build()
            .run();

            stopped_clone.store(true, SeqCst);
        });

        Self {
            tx,
            rx: app_rx,
            stopped
        }
    }
    
    pub fn get_next_message(&self) -> Option<Cmd> {
        if let Ok(UIEvents::Cmd(cmd)) = self.rx.try_recv() {
            
            return Some(cmd)

        }

        None
    }

    pub fn send_var_data(&self, data: Vec<GetResult>) {
        self.tx.send(UIEvents::VariableUpdate(data)).ok();
    }

    pub fn stopped(&self) -> bool {
        self.stopped.load(SeqCst)
    }
}
