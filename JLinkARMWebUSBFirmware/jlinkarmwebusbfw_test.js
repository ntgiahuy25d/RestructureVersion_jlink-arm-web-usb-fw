/*********************************************************************
*         Copyright [2023] Renesas Electronics Corporation           *
*                           www.renesas.com                          *
**********************************************************************

-------------------------- END-OF-HEADER -----------------------------

File    : jlinkarmwebusbfw_test.js
Purpose : Testing of J-Link Web USB firmware for Renesas RA devices
Literature:
  [1]  ...

Additional information:
  <Any additional information for this module>
*/

function ExecuteConnectBtn() {
  document.getElementById("ConnectBtn").disabled = true;
  Connect().then((resolve) => {
    document.getElementById("ConnectBtn").disabled = false;
  })
    .catch((e) => {
      document.getElementById("ConnectBtn").disabled = false;
    })
}
function ExecuteResetBtn() {
  document.getElementById("ResetBtn").disabled = true;
  Reset().then((resolve) => {
    document.getElementById("ResetBtn").disabled = false;
  })
    .catch((e) => {
      document.getElementById("ResetBtn").disabled = false;
    })
}
function ExecuteHaltBtn() {
  document.getElementById("HaltBtn").disabled = true;
  Halt().then((resolve) => {
    document.getElementById("HaltBtn").disabled = false;
  })
    .catch((e) => {
      document.getElementById("HaltBtn").disabled = false;
    })
}

function ExecuteUnHaltBtn() {
  document.getElementById("UnHaltBtn").disabled = true;
  UnHalt().then((resolve) => {
    document.getElementById("UnHaltBtn").disabled = false;
  })
    .catch((e) => {
      document.getElementById("UnHaltBtn").disabled = false;
    })
}

function ExecuteDisConnectBtn() {
  document.getElementById("DisConnectBtn").disabled = true;
  Disconnect().then((resolve) => {
    document.getElementById("DisConnectBtn").disabled = false;
  })
    .catch((e) => {
      document.getElementById("DisConnectBtn").disabled = false;
    })
}



async function Connect() {
  // Connect
  try {
    await WFW_Connect();
  } catch (error) {
    console.log(error);
  }
}
async function Reset() {
  // Connect
  try {
    await WFW_Reset();
  } catch (error) {
    console.log(error);
  }
}
async function Halt() {
  // Connect
  try {
    await WFW_Halt();
  } catch (error) {
    console.log(error);
  }
}
async function UnHalt() {
  // Connect
  try {
    await WFW_UnHalt();
  } catch (error) {
    console.log(error);
  }
}
async function Disconnect() {
  // Connect
  try {
    await WFW_Disconnect();
  } catch (error) {
    console.log(error);
  }
}