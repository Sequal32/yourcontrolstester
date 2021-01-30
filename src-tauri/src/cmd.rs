use serde::Deserialize;

use crate::gaugecommunicator::GetResult;

#[derive(Deserialize, Debug)]
#[serde(tag = "cmd", rename_all = "camelCase", content="data")]
pub enum Cmd {
    // your custom commands
    // multiple arguments are allowed
    // note that rename_all = "camelCase": you need to use "myCustomCommand" on JS
    SetVar { calculator: String },
    WatchVar { name: String, calculator: String },
    ResetVars
}

pub enum UIEvents {
    VariableUpdate(Vec<GetResult>),
    Cmd(Cmd)
}
