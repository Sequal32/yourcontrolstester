#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{thread::sleep, time::Duration};
use cmd::Cmd;
use gaugecommunicator::{LVarResult};
use simconnect::{SimConnector, DispatchResult};

mod cmd;
mod gaugecommunicator;
mod memwriter;
mod ui;

fn main() {
    // Two main handlers: UI & SimConnect
    let mut conn = SimConnector::new();
    let mut gauge_communicator = gaugecommunicator::GaugeCommunicator::new();
    let ui = ui::Ui::run();

    conn.connect("YourControls Definitions");
    gauge_communicator.on_connected(&conn);

    loop {

        match ui.get_next_message() {
            Some(Cmd::SetVar {calculator}) => {

                gauge_communicator.send_raw(&mut conn, &calculator);

            }
            Some(Cmd::WatchVar {name, calculator}) => {

                gauge_communicator.add_definition_raw(&conn, &calculator, &name);

            }
            Some(Cmd::ResetVars) => {

                conn.close();
                conn.connect("YourControls Definitions");
                gauge_communicator.clear();
                gauge_communicator.on_connected(&conn);

            }
            None => {}
        }

        match conn.get_next_message() {
            Ok(DispatchResult::ClientData(data)) => {

                match gauge_communicator.process_client_data(&conn, data) {
                    Some(LVarResult::Multi(data)) => {

                        ui.send_var_data(data);

                    }
                    _ => {}
                };

            }
            _ => {}
        }

        if ui.stopped() {
            return
        }

        sleep(Duration::from_millis(10))
    }
}
