/*********************************************************************
*                   (c) SEGGER Microcontroller GmbH                  *
*                        The Embedded Experts                        *
*                           www.segger.com                           *
**********************************************************************

-------------------------- END-OF-HEADER -----------------------------

File    : programming.js.download
Purpose : ...
Literature:
  [1]  ...

Additional information:
  <Any additional information for this module>
*/

/*********************************************************************
*
*       Defines, configurable
*
**********************************************************************
*/

//
// 0 == no debug log output
// 1 == debug log output in window
// 2 == debug log output in debugger
// 3 == debug log output in window and debugger
//
const _DEBUG = 1;

/*********************************************************************
*
*       Defines, fixed
*
**********************************************************************
*/
//
// J-Link USB commands
//
const EMU_CMD_SET_EMU_OPTION                      = 0x0E;
const EMU_CMD_CORESIGHT                           = 0x1A;
const EMU_CMD_GET_VERSION                         = 0x01;
const EMU_CMD_GET_CAPS                            = 0xE8;
const EMU_CMD_GET_CAPS_EX                         = 0xED;
const EMU_CMD_REGISTER                            = 0x09;
const EMU_CMD_GET_PROBE_INFO_CMD_GET_CAPS         = 0;
const EMU_CMD_CORESIGHT_CMD_CONFIG                = 0;
const EMU_CMD_CORESIGHT_CMD_DAP_ACC               = 1;
const EMU_CMD_GET_PROBE_INFO                      = 28;
const EMU_CMD_HW_SELECT_IF                        = 0xC7;
const EMU_CMD_SET_SPEED                           = 0x05;
const EMU_PROBE_INFO_SUB_CMD_WRITE_MSD_IMG_CHUNK  = 5;
const EMU_PROBE_INFO_SUB_CMD_WRITE_MSD_IMG_END    = 6;
//
// JLINK target interface settings
//
const JLINK_TIF_JTAG                              = 0x00;
const JLINK_TIF_SWD                               = 0x01;
//
// J-Link USB capabilities
//
const EMU_CAP_RESERVED                            = (1 << 0);
const EMU_CAP_GET_HW_VERSION                      = (1 << 1);
const EMU_CAP_WRITE_DCC                           = (1 << 2);
const EMU_CAP_ADAPTIVE_CLOCKING                   = (1 << 3);
const EMU_CAP_READ_CONFIG                         = (1 << 4);
const EMU_CAP_WRITE_CONFIG                        = (1 << 5);
const EMU_CAP_TRACE                               = (1 << 6);
const EMU_CAP_WRITE_MEM                           = (1 << 7);
const EMU_CAP_READ_MEM                            = (1 << 8);
const EMU_CAP_SPEED_INFO                          = (1 << 9);
const EMU_CAP_EXEC_CODE                           = (1 << 10);
const EMU_CAP_GET_MAX_BLOCK_SIZE                  = (1 << 11);
const EMU_CAP_GET_HW_INFO                         = (1 << 12);
const EMU_CAP_SET_KS_POWER                        = (1 << 13);
const EMU_CAP_RESET_STOP_TIMED                    = (1 << 14);
const EMU_CAP_SHORTEN_LIFE                        = (1 << 15);
const EMU_CAP_MEASURE_RTCK_REACT                  = (1 << 16);
const EMU_CAP_SELECT_IF                           = (1 << 17);
const EMU_CAP_RW_MEM_ARM79                        = (1 << 18);
const EMU_CAP_GET_COUNTERS                        = (1 << 19);
const EMU_CAP_READ_DCC                            = (1 << 20);
const EMU_CAP_GET_CPU_CAPS                        = (1 << 21);
const EMU_CAP_EXEC_CPU_CMD                        = (1 << 22);
const EMU_CAP_SWO                                 = (1 << 23);
const EMU_CAP_WRITE_DCC_EX                        = (1 << 24);
const EMU_CAP_UPDATE_FIRMWARE_EX                  = (1 << 25);
const EMU_CAP_FILE_IO                             = (1 << 26);
const EMU_CAP_REGISTER                            = (1 << 27);
const EMU_CAP_INDICATORS                          = (1 << 28);
const EMU_CAP_TEST_NET_SPEED                      = (1 << 29);
const EMU_CAP_RAWTRACE                            = (1 << 30);
const EMU_CAP_GET_CAPS_EX                         = (1 << 31);
//
// J-Link USB extended capabilities
//
const EMU_CAP_EX_SET_EMU_OPTION                   = 46;           // Supports command "EMU_CMD_SET_EMU_OPTION"
const EMU_CAP_EX_CORESIGHT_DAP_ACC                = 62;
const EMU_CAP_EX_GET_PROBE_INFO                   = 64;           // Supports EMU_CMD_GET_PROBE_INFO
//
// Caps for EMU_CMD_GET_PROBE_INFO
//
const EMU_PROBE_INFO_CAP_MSD_IMG                  = 2;
//
// Register sub commands
//
const REG_CMD_REGISTER                            = 100;
const REG_CMD_UNREGISTER                          = 101;
//
// CoreSight Register
//
const JLINK_CORESIGHT_WRITE                       = 0;
const JLINK_CORESIGHT_READ                        = 1;
const JLINK_CORESIGHT_DP                          = 0;
const JLINK_CORESIGHT_AP                          = 1;
const JLINK_CORESIGHT_DP_REG_IDCODE               = 0;
const JLINK_CORESIGHT_DP_REG_ABORT                = 0;
const JLINK_CORESIGHT_DP_REG_CTRL_STAT            = 1;
const JLINK_CORESIGHT_DP_REG_SELECT               = 2;
const JLINK_CORESIGHT_DP_REG_RDBUF                = 3;
const JLINK_CORESIGHT_AP_REG_CTRL                 = 0;          // CSW register
const JLINK_CORESIGHT_AP_REG_ADDR                 = 1;
const JLINK_CORESIGHT_AP_REG_DATA                 = 3;
//
// Host settings
//
const _MAIN_PIDx                                  = 0xAB;
const _MAIN_HostId                                = 0xCD;
const _MAX_DAP_JOB_SIZE                           = 0x400;

//
// System registers
//
// DHCSR
const ARM_CM_REG_DHCSR                            = 0xE000EDF0;
const ARM_CM_REG_DHCSR_DBGKEY                     = 0xA05F0000;
const ARM_CM_REG_DHCSR_C_MASKINTS                 = 0x8;
const ARM_CM_REG_DHCSR_C_DEBUGEN_ON               = 0x1;
// AIRCR
const ARM_CM_REG_AIRCR                            = 0xE000ED0C;
const ARM_CM_REG_AIRCR_VECTKEY                    = 0x05FA0000;
const ARM_CM_REG_AIRCR_SYSRESETREQ_ON             = 0x4;

/*********************************************************************
*
*       Static data
*
**********************************************************************
*/
var _Caps;
var _aCapsEx;
var _USBPort;
var _hFileSel;
var _ActiveCmd = { NumBytesReceived: 0 };
var _FWFileInfo = { aData : null, NumBytesWritten : 0 };
var _hProgBar;
var _IsConnected = 0;
var _tProgrammingStart;
var _MAIN_Stat;

/*********************************************************************
*
*       Prototypes
*
**********************************************************************
*/

Object.prototype.toHexString = function(HasPrefix) {
  return (HasPrefix ? "0x" : "") + this.toString(16).padStart(8, "0").toUpperCase();
}

/*********************************************************************
*
*       Local functions
*
**********************************************************************
*/

/*********************************************************************
*
*       _LogOut()
*/
function _LogOut(sLog) {
  var PreStr;

  PreStr = new Date().getTime().toString() + " - " + _LogOut.caller.name + ": ";
  if ((_DEBUG == 1) || (_DEBUG == 3)) {
    document.getElementById("LOG").innerHTML += PreStr + sLog+ "<br>";
    document.getElementById("LOG_DIV").scroll(0, 1000000);
  }
  if ((_DEBUG == 2) || (_DEBUG == 3)) {
      console.log(PreStr + sLog);
  }
}

/*********************************************************************
*
*       _PrintOutAddText()
*/
function _PrintOutAddText(Str) {
  document.getElementById("OUT").innerHTML += Str;
  document.getElementById("OUT_DIV").scroll(0, 1000000);
}

/*********************************************************************
*
*       _Store8LE()
*
*  Function description
*    Converts an U8 parameter to a byte array.
*/
function _Store8LE(aByte, Pos, Val) {
  new DataView(aByte.buffer).setUint8(Pos, Val);
}

/*********************************************************************
*
*       _Store16LE()
*
*  Function description
*    Converts an U16 parameter to a byte array.
*/
function _Store16LE(aByte, Pos, Val) {
  new DataView(aByte.buffer).setUint16(Pos, Val, true);
}

/*********************************************************************
*
*       _Store32LE()
*
*  Function description
*    Converts an U32 parameter to a byte array.
*/
function _Store32LE(aByte, Pos, Val) {
  new DataView(aByte.buffer).setUint32(Pos, Val, true);
}

/*********************************************************************
*
*       _Load8LE()
*
*  Function description
*    Reads an U8 parameter from a byte array.
*/
function _Load8LE(aByte, Pos) {
  return new DataView(aByte.buffer).getUint8(Pos, true);
}

/*********************************************************************
*
*       _Load16LE()
*
*  Function description
*    Reads an U16 parameter from a byte array.
*/
function _Load16LE(aByte, Pos) {
  return new DataView(aByte.buffer).getUint16(Pos, true);
}

/*********************************************************************
*
*       _Load32LE()
*
*  Function description
*    Reads an U32 parameter from a byte array.
*/
function _Load32LE(aByte, Pos) {
  return new DataView(aByte.buffer).getUint32(Pos, true);
}

/*********************************************************************
*
*       _Bin2String()
*/
function _Bin2String(array, iStart, NumBytes) {
  var result;
  var i;

  result = "";
  for (var i = 0; i < NumBytes; i++) {
    result += String.fromCharCode(parseInt(array[iStart], 10));  // Parse byte array as decimal numbers and convert them to characters
    iStart++;
  }
  return result;
}

/*********************************************************************
*
*       _ConcatTypedArrays()
*/
function _ConcatTypedArrays(a, b) { // a, b TypedArray of same type
  var c;

  c = new (a.constructor)(a.length + b.length);
  c.set(a, 0);
  c.set(b, a.length);
  return c;
}

/*********************************************************************
*
*       _ByteArrayToASCIIString()
*
*  Function description
*    Converts U8 byte array into a String
*/
function _ByteArrayToASCIIString(aByteArray) {
  var i;
  var Slice;

  i = aByteArray.indexOf(0);
  Slice = aByteArray.slice(0, i);
  return new TextDecoder().decode(Slice);
}

/*********************************************************************
*
*       _StringToByteArray()
*
*  Function description
*    Converts a String into an U8 byte array
*/
function _StringToByteArray(Text) {
  return new TextEncoder().encode(Text + "\0");
}

/*********************************************************************
*
*       _Init()
*/
function _Init() {
  //
  // Reset MAIN Stats
  //
  _MAIN_Stat = {
    NumConnections:  0,
    ConIndex:       -1,
    aConInfo:       [],
  }
}

/*********************************************************************
*
*       _DeInit()
*/
function _DeInit() {
  if (_IsConnected) {
    _USBPort.Disconnect();
    _LogOut("Disconnected USB device");
  }
  //
  // Reset statics
  //
  _IsConnected = 0;
  _USBPort = null;                                 // Invalidate port
  _ActiveCmd.NumBytesReceived = 0;
  _FWFileInfo.aData = null
  _FWFileInfo.NumBytesWritten = 0;
  //
  //
  //
  _MAIN_Stat = null                               // Let garbage collector take this
}

/*********************************************************************
*
*       _EmuHasCapEx()
*
*  Function description
*    Check if emulator has the specified extended capability
*/
function _EmuHasCapEx(CapEx) {
  var Byte;
  var Bit;

  if (_aCapsEx == null) {
    return false;
  }
  Byte = CapEx >> 3;
  Bit  = CapEx & 7;
  if (_aCapsEx[Byte] & (1 << Bit)) {
    return true;
  }
  return false;
}

/*********************************************************************
*
*       _cbOnError()
*
*  Function description
*    Called in case something goes wrong.
*    Disconnects from USB device if connected and resets internal state
*/
function _cbOnError(error) {
  _LogOut(error);
  document.getElementById("STATUS").innerHTML = error;
  _DeInit();
}

/*********************************************************************
*
*       _cbUSB_OnRecvError()
*
*  Function description
*    Called when a receive error happens on USB.
*/
function _cbUSB_OnRecvError(error) {
  _LogOut(error);
  _cbOnError("USB receive error: " + error);
}

/*********************************************************************
*
*       _cbUSB_OnSendError()
*
*  Function description
*    Called in case a USB write operation failed.
*
*  Notes
*    (1) The object that is passed to us is a <USBOutTransferResult> which is not documented yet (190523)
*        However, in the source code we found the definition of the attributes and methods
*        https://chromium.googlesource.com/chromium/blink/+/master/Source/modules/webusb/USBOutTransferResult.h
*/
function _cbUSB_OnSendError(Value) {
  var v;

  v = Value.status;
  _LogOut(v);
  _cbOnError("USB send error: " + v);
}

/*********************************************************************
*
*       _cbOnUSBRecv()
*/
function _cbOnUSBRecv(data) {
  var aDataTmp;
  //
  // The WebUSB API passes a <USBInTransferResult> object to this callback, on data reception.
  // https://wicg.github.io/webusb/#usbintransferresult
  // This object has 2 readonly members:
  //   <data> of type DataView
  //   <status> of type USBTransferStatus
  // USBTransferStatus is an "enum" that may have one of the following values: "ok" / "stall" / "babble"
  //
  data = data.data;                                         // We are only interested in the DataView part of the response
  //
  // Early out on NULL packet reception
  //
  if (data.byteLength == 0) {  // NULL packet received? => Early out
    return;
  }
  _LogOut("Received " + data.byteLength + " bytes");
  //
  // Add received data to the intermediate buffer.
  // If this is the 1st receive for the given command, make sure that we allocate a buffer
  //
  if (_ActiveCmd.NumBytesReceived) {                      // Already data in the buffer? => Concatenate
    _LogOut("Concat " + data.byteLength + " bytes");
    aDataTmp = new Uint8Array(data.buffer);               // Convert stream to U8 array
    _aDataBuf = _ConcatTypedArrays(_aDataBuf, aDataTmp);  // Extend existing buffer and add bytes to it
  } else {                                                // 1st receive? => Create buffer
    _LogOut("Copy " + data.byteLength + " bytes");
    _aDataBuf = new Uint8Array(data.buffer);              // Copy data into new tmp array
  }
  //
  // Increment buffer count.
  // _USB_Read() will schedule another read if necessary (not all bytes expected have been received yet).
  //
  _ActiveCmd.NumBytesReceived += data.byteLength;
}

/*********************************************************************
*
*       _USB_Read()
*
*  Notes
*    (1) async because it makes use of "await" to make asynchronous promise-code looking synchronous for better readability.
*/
async function _USB_Read(NumBytes) {
  //
  // Read data from J-Link until <NumBytes> request is fulfilled.
  // We may get more bytes from J-Link as requested in this call, so we need to buffer that for a subsequent _USB_Read() call
  // that then can feed the caller from the buffer instead of triggering another USB transaction.
  //
  // The idea is that the backend does large USB transfers to improve performance
  // but the application part can still request single bytes etc. that may be fed from an intermediate buffer.
  //
  while (_ActiveCmd.NumBytesReceived < NumBytes) {
    await _USBPort.Receive(_cbOnUSBRecv, _cbUSB_OnRecvError); // Schedule read + wait until read is complete
  }
  //
  // Copy from global buffer into local one and return requested data to caller
  //
  Slice = _aDataBuf.slice(0, NumBytes);    // Extract received data into separate buffer we pass to caller
  _aDataBuf = _aDataBuf.slice(NumBytes);   // Move remaining data to start of array
  _ActiveCmd.NumBytesReceived -= NumBytes; // Correct buffer fill state marker
  return Slice;
}

/*********************************************************************
*
*       _UpdateConTable()
*
*  Function description
*    Register / unregister the connection with the J-Link.
*/
async function _UpdateConTable(SubCmd) {
  var Handle;
  var NumBytesExpected;
  var NumConInfos;
  var SizeOfConInfo;
  var NumBytesAdd;
  var aTempBuf;
  var ConIndex;
  var aTempConInfoList;
  var NumConnections;
  var Vcc;
  var Pos;
  var Len;
  var i;

  _LogOut(((SubCmd == REG_CMD_REGISTER) ? "Register" : "Unregister") + " host @ J-Link");
  if ((_Caps & EMU_CAP_REGISTER) == 0) {
    throw new Error("EMU_CMD_REGISTER not supported (J-Link Rev. 3/4)");
  }
  // EMU_CMD_REGISTER
  // H->E 1-byte           <Cmd>
  // H->E 1-byte           <SubCmd>
  // H->E 4-byte           <PIDx>
  // H->E 4-byte           <HID>
  // H->E 1-byte           <IID>
  // H->E 1-byte           <CID>
  // H->E 2-byte           <Handle>
  // H<-E 2-byte           <Handle>
  // H<-E 2-byte           <NumConInfos>
  // H<-E 2-byte           <SizeOfConInfo>
  // H<-E 2-byte           <NumAddBytes>
  // H<-E x-byte           <NumAddBytes>+256 <ConInfoList>
  // H<-E 4-byte           <TargetVCC>
  //
  Handle                      = 0;                    // Not registered yet
  aDataDown                   = new Uint8Array(1 + 1 + 4 + 4 + 1 + 1 + 2);
  _Store8LE (aDataDown,  0, EMU_CMD_REGISTER);        // <Cmd>
  _Store8LE (aDataDown,  1, SubCmd);                  // <SubCmd>
  _Store32LE(aDataDown,  2, _MAIN_PIDx);              // <PIDx>
  _Store32LE(aDataDown,  6, _MAIN_HostId);            // <HID>
  _Store8LE (aDataDown, 10, 0);                       // <IID>
  _Store8LE (aDataDown, 11, 0);                       // <CID>
  _Store16LE(aDataDown, 12, Handle);                  // <Handle>
  _ActiveCmd.NumBytesReceived = 0;
  _USBPort.Send(aDataDown, null, _cbUSB_OnSendError); // Queue write
  NumBytesExpected = 12 + (4 * 16);
  aBuf = await _USB_Read(NumBytesExpected);
  Handle        = _Load16LE(aBuf, 0);                 // Handle
  NumConInfos   = _Load16LE(aBuf, 2);                 // NumConInfos
  SizeOfConInfo = _Load16LE(aBuf, 4);                 // SizeOfConInfo
  NumBytesAdd   = _Load16LE(aBuf, 6);                 // NumBytesAdd
  //
  // Retrieve additional connection infos
  //
  Len = 8 + (NumConInfos * SizeOfConInfo) + NumBytesAdd;
  if (Len > NumBytesExpected) {
    Len -= NumBytesExpected;
    aTempBuf = await _USB_Read(Len);
    aBuf = _ConcatTypedArrays(aBuf, aTempBuf);
  }
  //
  // Extract list of connection infos
  //
  aTempConInfoList = new Array(NumConInfos);
  for (i = 0; i < NumConInfos; i++) {
    Pos = 8 + (i * SizeOfConInfo);
    aTempConInfoList[i] = {
      PID:    _Load32LE(aBuf, Pos +  0),
      HID:    _Load32LE(aBuf, Pos +  4),
      IID:    _Load8LE (aBuf, Pos +  8),
      CID:    _Load8LE (aBuf, Pos +  9),
      Handle: _Load16LE(aBuf, Pos + 10),
      TSLast: _Load32LE(aBuf, Pos + 12),
    }
  }
  _MAIN_Stat.aConInfo = aTempConInfoList;
  aTempConInfoList = null; // Let garbage collector take this
  //
  // Handle remaining data of response
  //
  Vcc = _Load32LE(aBuf, aBuf.length - 4); // Ignore target VCC for now
  //
  // Find our newly registered connection in the list of connections
  //
  NumConnections = 0;
  ConIndex = -1;
  for (i = 0; i < _MAIN_Stat.aConInfo.length; i++) {
    if (_MAIN_Stat.aConInfo[i].Handle) {
      if ((_MAIN_Stat.aConInfo[i].PID == _MAIN_PIDx) && (_MAIN_Stat.aConInfo[i].HID == _MAIN_HostId) && (_MAIN_Stat.aConInfo[i].Handle == Handle)) {
        ConIndex = i;
      }
      NumConnections++;
    }
  }
  _MAIN_Stat.NumConnections = NumConnections;
  _MAIN_Stat.ConIndex = ConIndex;
  //
  // Check if J-Link has accepted the register
  //
  if ((SubCmd == REG_CMD_REGISTER) && (ConIndex < 0)) {
    _LogOut("Register failed.");
    return 0;
  }
  _LogOut("Registration info:");
  _LogOut("ConInfo Index: " + _MAIN_Stat.ConIndex);
  _LogOut(JSON.stringify(_MAIN_Stat.aConInfo[_MAIN_Stat.ConIndex]));
  return Vcc;
}

/*********************************************************************
*
*       _EmuCoreSightConfigure()
*
*  Function description
*    Configure CoreSight.
*/
async function _EmuCoreSightConfigure(ConfigString) {
  var aDataDown;
  var aConfigCharArray;

  _LogOut("Configure Coresight");
  if (_EmuHasCapEx(EMU_CAP_EX_CORESIGHT_DAP_ACC) == false) {
    throw new Error("Emulator does not support configuration for low-level DAP access.");
  }
  aConfigCharArray = _StringToByteArray(ConfigString);
  //
  // EMU_CMD_CORESIGHT
  // H->E 1-byte           <Cmd>
  // H->E 1-byte           <ConIndex>
  // H->E 1-byte           <SubCmd>
  // H->E 1-byte           <Dummy>
  // H->E 4-bytes          <NumBytesStr>
  // H->E x-bytes          <NumBytesStr> bytes <Configuration string>
  // H<-E 4-bytes          <Response>
  //
  aDataDown                   = new Uint8Array(4 + 4);
  _Store8LE (aDataDown, 0, EMU_CMD_CORESIGHT);
  _Store8LE (aDataDown, 1, _MAIN_Stat.ConIndex);
  _Store8LE (aDataDown, 2, EMU_CMD_CORESIGHT_CMD_CONFIG);
  _Store8LE (aDataDown, 3, 0);                                 // Dummy
  _Store32LE(aDataDown, 4, aConfigCharArray.length);
  aDataDown = _ConcatTypedArrays(aDataDown, aConfigCharArray); // Append String to message
  aConfigCharArray = null;                                     // Let garbage collector take this
  _ActiveCmd.NumBytesReceived = 0;
  _USBPort.Send(aDataDown, null, _cbUSB_OnSendError);          // Queues write and waits until it is complete
  aBuf = await _USB_Read(4);
  //
  // Check response
  //
  if (_Load32LE(aBuf, 0)) {
    throw new Error("Coresight configuration with '" + ConfigString + "' failed.");
  }
}

/*********************************************************************
*
*       _EmuCoreSightPerformDAPAcc()
*
*  Function description
*    Perform DAP access.
*    Complete job sequence must not take longer than 5 seconds, otherwise this will lead to USB communication timeouts on the J-Link side.
*    Usually, timeouts for a single "ReadDAPUntilMaskMatch" should be in the league of <= 100ms.
*/
async function _EmuCoreSightPerformDAPAcc(paAccDesc) {
  const HEADER_SIZE    = 4+4;
  const ACC_DESC_SIZE  = 20;
  const RESP_SIZE = 8;
  var NumEntries;
  var SplitNumEntries;
  var DataDownSize;
  var aDataDown;
  var Pos;
  var i;

  _LogOut("Coresight DAP accesss (" + paAccDesc.length + " times)");
  if (_EmuHasCapEx(EMU_CAP_EX_CORESIGHT_DAP_ACC) == false) {
    throw new Error("Emulator does not support configuration for low-level DAP access.");
  }
  //
  // Check if split of requests is necessary.
  // _MAX_DAP_JOB_SIZE should not exceed 1 KB to avoid deadlocks where J-Link needs to
  // get rid of response data before accepting further jobs and host side waits until
  // it has transmitted all jobs before requesting responses.
  //
  NumEntries = paAccDesc.length;
  DataDownSize = (HEADER_SIZE + (NumEntries * ACC_DESC_SIZE));
  if (DataDownSize > _MAX_DAP_JOB_SIZE) {
    //
    // Split request recursively
    //
    SplitNumEntries = Math.floor(_MAX_DAP_JOB_SIZE / ACC_DESC_SIZE);
    if ((HEADER_SIZE + (SplitNumEntries * ACC_DESC_SIZE)) > _MAX_DAP_JOB_SIZE) {
      SplitNumEntries--;
    }
    await _EmuCoreSightPerformDAPAcc(paAccDesc.slice(0, SplitNumEntries));
    await _EmuCoreSightPerformDAPAcc(paAccDesc.slice(SplitNumEntries, (NumEntries + 1)));
  }

  if (paAccDesc.length == 0) {
    return; // Nothing to do
  }
  //
  // EMU_CMD_CORESIGHT_CMD_DAP_ACC
  // H->E 1-byte           <Cmd>
  // H->E 1-byte           <ConIndex>
  // H->E 1-byte           <SubCmd>
  // H->E 1-byte           <Dummy>
  // H->E 1-byte           <Cmd>
  // H->E 4-bytes          <NumAcc>
  // H->E x-bytes          <NumAcc>*20 bytes <AccDesc>
  // H<-E x-bytes          <NumAcc>*8 bytes <Resp>
  //
  aDataDown                   = new Uint8Array(DataDownSize);
  _Store8LE (aDataDown, 0, EMU_CMD_CORESIGHT);
  _Store8LE (aDataDown, 1, _MAIN_Stat.ConIndex);
  _Store8LE (aDataDown, 2, EMU_CMD_CORESIGHT_CMD_DAP_ACC);
  _Store8LE (aDataDown, 3, 0);                                             // Dummy for alignment
  _Store32LE(aDataDown, 4, NumEntries);
  Pos = 8;
  for (i = 0; i < NumEntries; i++) {
    //
    // If any of the following keys is not defined, set default.
    // The default is always read of the AP data register.
    //
    if (paAccDesc[i].Data               == undefined) { paAccDesc[i].Data               = 0; }
    if (paAccDesc[i].Mask               == undefined) { paAccDesc[i].Mask               = 0; }
    if (paAccDesc[i].CompVal            == undefined) { paAccDesc[i].CompVal            = 0; }
    if (paAccDesc[i].Status             == undefined) { paAccDesc[i].Status             = 0; }
    if (paAccDesc[i].TimeoutMsReadUntil == undefined) { paAccDesc[i].TimeoutMsReadUntil = 0; }
    if (paAccDesc[i].RegIndex           == undefined) { paAccDesc[i].RegIndex           = JLINK_CORESIGHT_AP_REG_DATA; }
    if (paAccDesc[i].APnDP              == undefined) { paAccDesc[i].APnDP              = JLINK_CORESIGHT_AP; }
    if (paAccDesc[i].RnW                == undefined) { paAccDesc[i].RnW                = JLINK_CORESIGHT_READ; }
    //
    // Fill transfer buffer
    //
    _Store32LE(aDataDown, Pos, paAccDesc[i].Data);               Pos += 4;
    _Store32LE(aDataDown, Pos, paAccDesc[i].Mask);               Pos += 4;
    _Store32LE(aDataDown, Pos, paAccDesc[i].CompVal);            Pos += 4;
    _Store32LE(aDataDown, Pos, paAccDesc[i].TimeoutMsReadUntil); Pos += 4;
    _Store8LE (aDataDown, Pos, paAccDesc[i].RegIndex);           Pos += 1;
    _Store8LE (aDataDown, Pos, paAccDesc[i].APnDP);              Pos += 1;
    _Store8LE (aDataDown, Pos, paAccDesc[i].RnW);                Pos += 1;
    _Store8LE (aDataDown, Pos, 0);                               Pos += 1; // Dummy for alignment
  }
  _ActiveCmd.NumBytesReceived = 0;
  _USBPort.Send(aDataDown, null, _cbUSB_OnSendError);                      // Queues write and waits until it is complete
  aBuf = await _USB_Read(NumEntries * RESP_SIZE);
  //
  // Store result
  //
  for (i = 0; i < NumEntries; i++) {
    paAccDesc[i].Status = _Load32LE(aBuf, (i * 8));
    if (paAccDesc[i].RnW) {
      paAccDesc[i].Data   = _Load32LE(aBuf, (i * RESP_SIZE) + 4);
    }
    _LogOut((paAccDesc[i].APnDP ? "AP" : "DP") + " " + (paAccDesc[i].RnW ? "read" : "write"));
    _LogOut(" Register: " + paAccDesc[i].RegIndex);
    _LogOut(" Status: " + paAccDesc[i].Status);
    _LogOut(" Data:  " + paAccDesc[i].Data.toHexString(true));
  }
}

/*********************************************************************
*
*       _CoreSightWriteDAP()
*/
async function _CoreSightWriteDAP(RegIndex, ApnDP, Data) {
  var AccDesc;

  AccDesc = {
      Data:               Data,
      RegIndex:           RegIndex,
      APnDP:              ApnDP,
      RnW:                JLINK_CORESIGHT_WRITE,
    };
  await _EmuCoreSightPerformDAPAcc([AccDesc]);
  if (AccDesc.Status) {
    throw new Error("CoreSight write DAP failed: " + AccDesc);
  }
}

/*********************************************************************
*
*       _CoreSightReadDAP()
*/
async function _CoreSightReadDAP(RegIndex, ApnDP) {
  var AccDesc;

  AccDesc = {
      RegIndex:           RegIndex,
      APnDP:              ApnDP,
      RnW:                JLINK_CORESIGHT_READ,
    };
  await _EmuCoreSightPerformDAPAcc([AccDesc]);
  if (AccDesc.Status) {
    throw new Error("CoreSight read DAP failed: " + AccDesc);
  }
  return AccDesc.Data;
}

/*********************************************************************
*
*       _CoreSightWriteDP()
*/
async function _CoreSightWriteDP(RegIndex, Data) {
  await _CoreSightWriteDAP(RegIndex, JLINK_CORESIGHT_DP, Data);
}

/*********************************************************************
*
*       _CoreSightWriteAP()
*/
async function _CoreSightWriteAP(RegIndex, Data) {
  await _CoreSightWriteDAP(RegIndex, JLINK_CORESIGHT_AP, Data);
}

/*********************************************************************
*
*       _CoreSightReadDP()
*/
async function _CoreSightReadDP(RegIndex) {
  return await _CoreSightReadDAP(RegIndex, JLINK_CORESIGHT_DP);
}

/*********************************************************************
*
*       _CoreSightReadAP()
*/
async function _CoreSightReadAP(RegIndex) {
  return await _CoreSightReadDAP(RegIndex, JLINK_CORESIGHT_AP);
}

/*********************************************************************
*
*       _ReadMem32()
*  Function description
*    Reads one or multiple 32-bit values from target
*    Return data is specified as Uint32Array
*/
async function _ReadMem32(Addr, Length) {
  var AccDescList;
  var Results;
  var i;
  //
  // Fill the job array with read jobs.
  // However, 'fill' will copy the reference, so we use a different approach
  //
  _LogOut("Read " + (Length * 4) + " bytes @" + Addr.toHexString(true));
  AccDescList = new Array(Length + 1).fill(null).map(() => ({}));  // Defaults set by _EmuCoreSightPerformDAPAcc() will lead to ReadAP(3) (DATA register) accesses.
  //
  // Job[0] setups the memory address to access with the R/W memory operation.
  //
  AccDescList[0] = {
    Data:               Addr,
    RegIndex:           JLINK_CORESIGHT_AP_REG_ADDR,
    RnW:                JLINK_CORESIGHT_WRITE,
  };
  await _EmuCoreSightPerformDAPAcc(AccDescList);
  //
  // Prepare result
  //
  Results = new Uint32Array(Length).map((value, index) => {
    return AccDescList[index + 1].Data;
  });
  AccDescList = null; // Let gargabe collector take this
  return Results;
}

/*********************************************************************
*
*       _WriteMem32()
*
*  Function description
*    Write one or multiple 32-bit values to target
*    Specify data as Uint32Array
*/
async function _WriteMem32(Addr, aData) {
  var AccDescList;
  var Results;
  var i;
  //
  // Fill the job array with write jobs.
  // However, 'fill' will copy the reference, so we use a different approach
  //
  _LogOut("Write " + (aData.length * 4) + " bytes to " + Addr.toHexString(true));
  AccDescList = new Array(aData.length + 1).fill(null).map(() =>
    ({ // Write data
      RnW: JLINK_CORESIGHT_WRITE,
    })
  );
  //
  // Job[0] setups the memory address to access with the R/W memory operation.
  //
  AccDescList.map((obj, index) => {
    if (index == 0) {
      obj.Data = Addr;
      obj.RegIndex = JLINK_CORESIGHT_AP_REG_ADDR;
    } else {
      obj.Data = aData[index -1];
    }
  });
  await _EmuCoreSightPerformDAPAcc(AccDescList);
}

/*********************************************************************
*
*       _InitDAP()
*/
async function _InitDAP() {
  var AccDescList;
  const APConfig = (2 <<  0)      // Access size: word
                 | (1 <<  4)      // No auto increment
                 | (1 << 24)      // Reserved
                 | (1 << 25)      // Private access
                 | (1 << 29)      // MasterType == Debug
                 ;

  _LogOut("Initialize DAP");
  AccDescList = [
    { //
      // Clear AP error flags
      //
      Data:               0x1E,
      RegIndex:           JLINK_CORESIGHT_DP_REG_ABORT,
      APnDP:              JLINK_CORESIGHT_DP,
      RnW:                0,
    },
    { //
      // Set CSYSPWRUPREQ and CDBGPWRUPREQ
      //
      Data:               ((1 << 30) | (1 << 28)),
      RegIndex:           JLINK_CORESIGHT_DP_REG_CTRL_STAT,
      APnDP:              JLINK_CORESIGHT_DP,
      RnW:                0,
    },
    { //
      // Wait for CSYSPWRUPACK to get set.
      // Also verify that xxxREQ bits got written correctly
      // Do not wait for SYSPWRUPACK to get set as on some chips under some circumstances,
      // this bit does not get set but the DAP is fully usable though.
      //
      Data:               0,
      Mask:               (0x7 << 28),
      CompVal:            (0x7 << 28),
      TimeoutMsReadUntil: 100,
      RegIndex:           JLINK_CORESIGHT_DP_REG_CTRL_STAT,
      APnDP:              JLINK_CORESIGHT_DP,
      RnW:                1,
    },
    {
      //
      // Select AP and AP bank to be used.
      //
      Data:               0, // Select bank 0, index 0
      RegIndex:           JLINK_CORESIGHT_DP_REG_SELECT,
      APnDP:              JLINK_CORESIGHT_DP,
      RnW:                0,
    },
    {
      //
      // Perform "one-time" AP setup like access width to be used for memory accesses via the AP.
      //
      Data:               APConfig,
      RegIndex:           JLINK_CORESIGHT_AP_REG_CTRL,
      APnDP:              JLINK_CORESIGHT_AP,
      RnW:                0,
    },
  ];
  await _EmuCoreSightPerformDAPAcc(AccDescList);
}

/*********************************************************************
*
*       _PrintOutWriteMem32()
*
*  Function description
*    Prints a Mem32 command and its output to the output window
*    Specify data as Uint32Array
*/
function _PrintOutReadMem32(Addr, aData) {
  var Str;
  var Cnt;
  var Rem;
  var i;

  Str = "";
  Cnt = 0;
  document.getElementById("OUT").innerHTML += "> Mem32 " + Addr.toHexString(true) + " " + aData.length.toHexString(true) + "<br>";
  while (Cnt < aData.length) {
    if ((Cnt == 0) || Math.floor(Cnt / 4)) {
      Str += "> " + Addr.toHexString(false) + " = ";
      Addr += 4;
    } // TODO
    Rem = aData.length - Cnt;
    for (i = 0; i < (Rem > 4 ? 4 : Rem); i++) {
      Str += aData[Cnt++].toHexString(false) + " ";
    }
    Str += "<br>";
  }
  _PrintOutAddText(Str);
}

/*********************************************************************
*
*       _PrintOutWriteMem32()
*
*  Function description
*    Prints one or multiple Write4 commands to the output window
*    Specify data as Uint32Array
*/
function _PrintOutWriteMem32(Addr, aData) {
  var Str;
  var i;

  Str = "";
  for (i = 0; i < aData.length; i++) {
    Str += "> Write4 " + Addr.toHexString(true) + " " + _Load32LE(aData, i).toHexString(true) + "<br>";
    Str += "> Writing " + aData[i].toHexString(false) + " -> " + Addr.toHexString(false) + "<br>";
    Addr += 4;
  }
  _PrintOutAddText(Str);
}

/*********************************************************************
*
*       _TestRWMem()
*/
async function _TestRWMem() {
  var Addr;
  var NumWords;
  var TestData;
  var ReadData;
  //
  // Setup <Addr> and <NumWords> to be used for this test
  //
  Addr     = 0x20010000;
  NumWords = 64;
  _LogOut("Begin memory example");
  //
  // Read memory
  //
  ReadData = await _ReadMem32(Addr, NumWords);
  _PrintOutReadMem32(Addr, ReadData);
  //
  // Write memory
  //
  TestData = new Uint32Array(NumWords);
  for (i = 0; i < TestData.length; i += 1) {
    TestData[i] = i;
  }
  await _WriteMem32(Addr, TestData);
  _PrintOutWriteMem32(Addr, TestData);
  TestData = null; // Let garbage collector take this
  //
  // Read memory
  //
  ReadData = await _ReadMem32(Addr, NumWords);
  _PrintOutReadMem32(Addr, ReadData);
  _LogOut("End memory example");
}

/*********************************************************************
*
*       _ConnectTarget()
*/
async function _ConnectTarget() {
  var Vcc;
  var IdCode;
  var MaxTransferSize;

  _LogOut("Connect target");
  //
  // These MUST(!!!!) be the very first commands to J-Link, to be backward compatible to some older probes.
  // Never, absolutely NEVER change this!
  // Sequence is:
  //   1) EMU_CMD_GET_VERSION
  //   2) EMU_CMD_GET_CAPS
  //   3) EMU_CMD_GET_CAPS_EX    => Only issued if EMU_CMD_GET_CAPS indicated that CAPS_EX is supported
  //   4) EMU_CMD_GET_VERSION    => For old units that use "stay in BTL" with "USB start configured" there may be a BTL -> FW jump issued by the reception of GET_CAPS, so the 2nd read of FW string may return something different than the 1st one
  //
  //
  // EMU_CMD_GET_VERSION
  // H->E 1-byte           <Cmd>
  // H<-E 2-byte           <Len>
  // H<-E x-byte           <Len> bytes <FWString>
  //
  aDataDown                   = new Uint8Array([EMU_CMD_GET_VERSION]);
  _ActiveCmd.NumBytesReceived = 0;
  _USBPort.Send(aDataDown, null, _cbUSB_OnSendError);   // Queue write
  aBuf = await _USB_Read(2);                            // Receive <Len> from J-Link (Implicitly waits for previous send() to finish before starting receive)
  v = _Load16LE(aBuf, 0);                               // Load <Len>
  FWStr = await _USB_Read(v);                           // Receive FW string
  //
  // EMU_CMD_GET_CAPS
  // H->E 1-byte           <Cmd>
  // H<-E 4-byte           <Caps>
  //
  aDataDown                   = new Uint8Array([EMU_CMD_GET_CAPS]);
  _ActiveCmd.NumBytesReceived = 0;
  _USBPort.Send(aDataDown, null, _cbUSB_OnSendError);              // Queue write
  aBuf = await _USB_Read(4);                                       // Receive <Caps> from J-Link (Implicitly waits for previous send() to finish before starting receive)
  _Caps = _Load32LE(aBuf, 0);
  //
  // EMU_CMD_GET_CAPS_EX
  // H->E 1-byte           <Cmd>
  // H<-E 32-byte          <CapsEx>
  //
  aDataDown                   = new Uint8Array([EMU_CMD_GET_CAPS_EX]);
  _ActiveCmd.NumBytesReceived = 0;
  _USBPort.Send(aDataDown, null, _cbUSB_OnSendError);               // Queue write
  aBuf = await _USB_Read(32);                                       // Receive <Caps> from J-Link (Implicitly waits for previous send() to finish before starting receive)
  _aCapsEx = aBuf.slice();
  //
  // Current J-Links support a "MaxTransactionSize" setting.
  // This determines when NULL packets are not sent.
  // As we do not know how a previous session may have left the J-Link, set it to the backward-compatible 2K mode.
  //
  // EMU_CMD_SET_EMU_OPTION
  // H->E 1-byte  <Cmd>
  // H->E 4 bytes <OptionType>
  // H->E 4 bytes <OptionValue>
  // H->E 2 bytes <ConnectionHandle> (Only needed by some verify specific EMU options that may follow after a REG_CMD_REGISTER)
  // H->E 6 bytes <Dummy>. Reserved for future use, must be 0 for now
  // H<-E 4-byte           <Response>
  //
  // Probes that do not support EMU_CMD_SET_EMU_OPTION always run in the old 2K mode.
  //
  if (_EmuHasCapEx(EMU_CAP_EX_SET_EMU_OPTION) == true) {
    MaxTransferSize = 2048;           				  // 2K mode
    aDataDown       = new Uint8Array(1 + 4 + 4 + 2 + 6);
    _Store8LE (aDataDown, 0, EMU_CMD_SET_EMU_OPTION);
    _Store32LE(aDataDown, 1, 5);                      // Option == SET_MAX_TRANSFER_SIZE
    _Store32LE(aDataDown, 5, MaxTransferSize);
    _Store16LE(aDataDown, 9, 0);                      // Dummy handle == 0 as it is not needed for this <OptionType>
    _Store8LE (aDataDown, 11,0);                      // Dummy
    _Store8LE (aDataDown, 12,0);                      // Dummy
    _Store8LE (aDataDown, 13,0);                      // Dummy
    _Store8LE (aDataDown, 14,0);                      // Dummy
    _Store8LE (aDataDown, 15,0);                      // Dummy
    _Store8LE (aDataDown, 16,0);                      // Dummy
    _ActiveCmd.NumBytesReceived = 0;
    _USBPort.Send(aDataDown, null, _cbUSB_OnSendError);               // Queue write
    aBuf = await _USB_Read(4);                                        // Receive <Response>
    _USBPort.SetMaxTransferSize(MaxTransferSize);
  }
  //
  // EMU_CMD_GET_VERSION
  // H->E 1-byte           <Cmd>
  // H<-E 2-byte           <Len>
  // H<-E x-byte           <Len> bytes <FWString>
  //
  aDataDown                   = new Uint8Array([EMU_CMD_GET_VERSION]);
  _ActiveCmd.NumBytesReceived = 0;
  _USBPort.Send(aDataDown, null, _cbUSB_OnSendError);   // Queue write
  aBuf = await _USB_Read(2);                            // Receive <Len> from J-Link (Implicitly waits for previous send() to finish before starting receive)
  v = _Load16LE(aBuf, 0);                               // Load <Len>
  FWStr = await _USB_Read(v);                           // Receive FW string
  //
  // Show FW string on page
  //
  s = _ByteArrayToASCIIString(FWStr);   // Convert byte array of v-byte to string. Also remove trailing zero-termination characters and do to copy them into the string
  document.getElementById("FWSTR").innerHTML = s;
  //
  // Read config area
  // H->E  1 byte Cmd
  // H->E  1 byte SubCmd
  // H->E  4 bytes NumDataBytes following
  // H->E  <NumDataBytes> bytes of data + 4 bytes CRC of data
  // H->E  8 Bytes key value "IDSEGGER" 0x49 0x44 0x53 0x45 0x47 0x47 0x45 0x52
  // E->H  4 bytes response (< 0 error, >= 0 O.K., NumBytesConfigData)
  // E->H  Response data bytes in case of response > 0
  //
  // This is mainly test code for NULL packet handling because the config area is 8 KB in size on current J-Links.
  //
/*
  aDataDown = new Uint8Array(1 + 1 + 4);
  Off = 0;
  _Store8LE(aDataDown,  Off, 0x16); Off++;     // EMU_CMD_HANDLE_OTSX_CONFIGX
  _Store8LE(aDataDown,  Off, 0);    Off++;     // SUB_CMD_READ_CONFIG
  _Store32LE(aDataDown, Off, 0);    Off += 4;  // No data + CRC follows
  aDataDown = _ConcatTypedArrays(aDataDown, new Uint8Array([0x49, 0x44, 0x53, 0x45, 0x47, 0x47, 0x45, 0x52])); Off += 8; // "IDSEGGER"
  _USBPort.Send(aDataDown, null, _cbUSB_OnSendError);   // Queue write
  aBuf = await _USB_Read(4);                            // Receive <Len> from J-Link (Implicitly waits for previous send() to finish before starting receive)
  v = _Load16LE(aBuf, 0);                               // Load <Len>
  if (v > 0) {
    aBuf = await _USB_Read(v);
  }
*/
  //
  // Register this host process @ J-Link
  //
  Vcc = await _UpdateConTable(REG_CMD_REGISTER);
  Vcc /= 1000;
  //
  // Select TIF == SWD
  // H->E 1-byte           <Cmd>
  // H->E 1-byte           <SubCmd>
  // H<-E 4-byte           <Response> (U32: Previously selected TIF)
  //
  aDataDown                   = new Uint8Array(1 + 1);
  _Store8LE(aDataDown, 0, EMU_CMD_HW_SELECT_IF);
  _Store8LE(aDataDown, 1, JLINK_TIF_SWD);
  _USBPort.Send(aDataDown, null, _cbUSB_OnSendError); // Queues write
  aBuf = await _USB_Read(4);                          // Receive <Len> from J-Link (Implicitly waits for previous send() to finish before starting receive)
  //
  // Select TIF speed == 4000 kHz
  // H->E 1-byte           <Cmd>
  // H->E 2-byte           <Speed_kHz> (0xFFFF has special meaning: Adaptive clocking)
  // No response from J-Link to this command!
  //
  Speed = 4000;  // Select 4 MHz
  aDataDown                   = new Uint8Array(1 + 2);
  _Store8LE (aDataDown, 0, EMU_CMD_SET_SPEED);
  _Store16LE(aDataDown, 1, Speed);
  _USBPort.Send(aDataDown, null, _cbUSB_OnSendError); // Queues write and waits until it is complete
  //
  // Init CORESIGHT module on J-Link for further use
  //
  await _EmuCoreSightConfigure("");
  //
  // Request ID Code
  //
  IdCode = await _CoreSightReadDP(JLINK_CORESIGHT_DP_REG_IDCODE);
  //
  // Output status
  //
  document.getElementById("IDCODE").innerHTML = " 0x" + IdCode.toString(16).toUpperCase();
  document.getElementById("VCC").innerHTML = " " + Vcc + "V";
  //
  // InitDAP
  //
  await _InitDAP();
  //
  // Application test
  //
  //await _TestRWMem();
  //
  // Reset
  //
  await WFW_RESET();
  //
  // Unregister this hots process from J-Link
  //
  await _UpdateConTable(REG_CMD_UNREGISTER);
}

/*********************************************************************
*
*       _DoStuff()
*
*  Function description
*    Called when the "Connect" button is clicked
*/
async function _DoStuff() {
  await _USBPort.Connect();                        // Schedules asynchronous connect + waits for it to complete
  _IsConnected = 1;
  document.getElementById("STATUS").innerHTML = "Connected";
  await _ConnectTarget();
  _DeInit();
  document.getElementById("STATUS").innerHTML = "Disconnected";
}

/*********************************************************************
*
*       Global functions
*
**********************************************************************
*/

/*********************************************************************
*
*       PROGRAMMING_cbOnClick_Connect()
*
*  Function description
*    Called when the "Connect" button is clicked
*/
function PROGRAMMING_cbOnClick_Connect() {
  var ObjPromise;
  var is_Chrome;
  //
  // Early outs
  //
  _LogOut("Connect from user");
  if (_IsConnected) {                       // Already connected? => Done
    return;
  }
  document.getElementById("BUTTON").disabled = true;
  document.getElementById("LOG").innerHTML = "Enable log with _DEBUG = 1 or _DEBUG = 3<br>";
  document.getElementById("OUT").innerHTML = "";
  //
  // Trigger connect
  //
  _Init();
  document.getElementById("STATUS").innerHTML = "Opening USB connection...";
  if (_USBPort == undefined) {
    _USBPort = new SeggerBulk(); // Create a new instance of SeggerBulk only if none has been created so far
  }
  _DoStuff().then((resolve) => {
    //
    // _DoStuff terminated with success
    //
    document.getElementById("BUTTON").disabled = false;
  })
  .catch((e) => {
    //
    // An error occured in _DoStuff
    //
    document.getElementById("BUTTON").disabled = false;
    document.getElementById("STATUS").innerHTML = " " + e;
  })
}

/*********************************************************************
*
*       WFW_RESET()
*
*  Function description
*    Reset the MCU
*/
async function WFW_RESET() {
  var readData;

  // Clear history reset flag (DHCSR.RESET_ST == 0)
  _LogOut("Clear history reset flag (DHCSR.RESET_ST == 0)");
  while (true) {
    readData = await _ReadMem32(ARM_CM_REG_DHCSR, 1);
    _LogOut("readData = " + readData[0].toHexString(true));
    readData = ((readData[0] >> 25) & 0x1) >>> 0;
    if (readData == 0) {
      _LogOut("First clear RESET_ST");
      break;
    }
  }

  // Reset by writing to SYSRESETREQ
  _LogOut("Reset by writing to SYSRESETREQ");
  TestData = new Uint32Array(1);
  TestData[0] = (ARM_CM_REG_AIRCR_VECTKEY | ARM_CM_REG_AIRCR_SYSRESETREQ_ON) >>> 0;
  _LogOut("Data to write: " + TestData[0].toHexString(true));
  await _WriteMem32(ARM_CM_REG_AIRCR, TestData);
  //_PrintOutWriteMem32(Addr, TestData);

  // Re-Authentication (Some CM devices require authorize after reseting)

  // Wait for reset is performed (DHCSR.RESET_ST == 1)
  _LogOut("Wait for reset is performed (DHCSR.RESET_ST == 1)");
  while (true) {
    readData = await _ReadMem32(ARM_CM_REG_DHCSR, 1);
    readData = ((readData[0] >> 25) & 0x1) >>> 0;
    if (readData == 1) {
      _LogOut("RESET_ST = 1");
      break;
    }
  }

  // Clear history reset flag (DHCSR.RESET_ST == 0)
  _LogOut("Clear history reset flag (DHCSR.RESET_ST == 0)");
  while (true) {
    readData = await _ReadMem32(ARM_CM_REG_DHCSR, 1);
    _LogOut("readData = " + readData[0].toHexString(true));
    readData = ((readData[0] >> 25) & 0x1) >>> 0;
    if (readData == 0) {
      _LogOut("Clear RESET_ST");
      break;
    }
  }
}