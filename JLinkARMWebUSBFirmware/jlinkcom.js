/*********************************************************************
*         Copyright [2023] Renesas Electronics Corporation           *
*                           www.renesas.com                          *
**********************************************************************

-------------------------- END-OF-HEADER -----------------------------

File    : js
Purpose : Implementation of J-Link Web USB communication
Literature:
  [1]  ...

Additional information:
  <Any additional information for module>
*/

  /*********************************************************************
  *
  *       Fields
  *
  **********************************************************************
  */
  /*****************************************************
  * _DEBUG: Enable or Disable debug log
  */
  // Disable Debug mode (No log displayed on the browser console)
  const _DEBUG_DISABLE = 0;
  // Simple Debug mode (Simple log - displayed only message on the console)
  const _DEBUG_SIMP = 1;
  // Full Debug mode (Message and target caller displayed on the browser console)
  const _DEBUG_FULL = 2;

  const _DEBUG = _DEBUG_FULL;

  /*****************************************************
  * _MAIN_Stat: Communication status
  */
  var _MAIN_Stat;
  /*****************************************************
  * _IsConnected: Connection status
  */
  var _IsConnected = 0;
  /*****************************************************
  * _USBPort: USB Port of J-Link
  */
  var _USBPort;
  /*****************************************************
  * _ActiveCmd: Active Command on USB port
  */
  var _ActiveCmd = { NumBytesReceived: 0 };
  /*****************************************************
  * _Caps: J-Link capabilities
  */
  var _Caps;
  /*****************************************************
  * _aCapsEx: J-Link extended capabilities
  */
  var _aCapsEx;


  /*********************************************************************
  *
  *       Defines. DO NOT CHANGE
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


  /*********************************************************************
  *
  *       Public functions
  *
  **********************************************************************
  */

  /*****************************************************
  * UsbConnect(): Connect to available USB Port
  */
  async function UsbConnect() {

    // Reset MAIN Stats
    _MAIN_Stat = {
      NumConnections:  0,
      ConIndex:       -1,
      aConInfo:       [],
    }
    // Create new USB Port
    LogOut("Connect to USB port");
    if (_USBPort == undefined) {
      _USBPort = new SeggerBulk(); // Create a new instance of SeggerBulk only if none has been created so far
    }
    await _USBPort.Connect();                      // Schedules asynchronous connect + waits for it to complete
    _IsConnected = 1;
    // Check if already connected or not

    // Connect target
    await ConnectTarget();
  }

  /*****************************************************
  * UsbDisConnect(): Disconnect from USb port
  */
  async function UsbDisConnect() {
    // Unregister hots process from J-Link
    await UpdateConTable(REG_CMD_UNREGISTER);

    // Disconnect from USB Port
    if (_IsConnected) {
      _USBPort.Disconnect();
      LogOut("Disconnected from USB device");
    }

    // Reset const
    _IsConnected = 0;
    _USBPort = null;
    _ActiveCmd.NumBytesReceived = 0;
    _MAIN_Stat = null
  }

  /*****************************************************
  * CoreSightWriteDAP(): Write DAP
  */
  async function CoreSightWriteDAP(RegIndex, ApnDP, Data) {
    var AccDesc;

    AccDesc = {
        Data:               Data,
        RegIndex:           RegIndex,
        APnDP:              ApnDP,
        RnW:                JLINK_CORESIGHT_WRITE,
      };
    await EmuCoreSightPerformDAPAcc([AccDesc]);
    if (AccDesc.Status) {
      throw new Error("CoreSight write DAP failed: " + AccDesc);
    }
  }

  /*****************************************************
  * CoreSightReadDAP(): Read DAP
  */
  async function CoreSightReadDAP(RegIndex, ApnDP) {
    var AccDesc;

    AccDesc = {
        RegIndex:           RegIndex,
        APnDP:              ApnDP,
        RnW:                JLINK_CORESIGHT_READ,
      };
    await EmuCoreSightPerformDAPAcc([AccDesc]);
    if (AccDesc.Status) {
      throw new Error("CoreSight read DAP failed: " + AccDesc);
    }
    return AccDesc.Data;
  }

  /*****************************************************
  * CoreSightWriteDP(): Write DP
  */
  async function CoreSightWriteDP(RegIndex, Data) {
    await CoreSightWriteDAP(RegIndex, JLINK_CORESIGHT_DP, Data);
  }
  /*****************************************************
  * CoreSightWriteDP(): Read DP
  */
  async function CoreSightReadDP(RegIndex) {
    return await CoreSightReadDAP(RegIndex, JLINK_CORESIGHT_DP);
  }


  /*****************************************************
  * CoreSightWriteAP(): Write AP
  */
  async function CoreSightWriteAP(RegIndex, Data) {
    await CoreSightWriteDAP(RegIndex, JLINK_CORESIGHT_AP, Data);
  }

  /*****************************************************
  * CoreSightReadAP(): Read AP
  */
  async function CoreSightReadAP(RegIndex) {
    return await CoreSightReadDAP(RegIndex, JLINK_CORESIGHT_AP);
  }

  /*****************************************************
  * ReadMem32(): Reads one or multiple 32-bit values from target. Return data is specified as Uint32Array
  */
  async function ReadMem32(Addr, Length) {
    var AccDescList;
    var Results;
    var i;
    //
    // Fill the job array with read jobs.
    // However, 'fill' will copy the reference, so we use a different approach
    //
    LogOut("Read " + (Length * 4) + " bytes @" + ToHexString(Addr, true));
    AccDescList = new Array(Length + 1).fill(null).map(() => ({}));  // Defaults set by _EmuCoreSightPerformDAPAcc() will lead to ReadAP(3) (DATA register) accesses.
    //
    // Job[0] setups the memory address to access with the R/W memory operation.
    //
    AccDescList[0] = {
      Data:               Addr,
      RegIndex:           JLINK_CORESIGHT_AP_REG_ADDR,
      RnW:                JLINK_CORESIGHT_WRITE,
    };
    await EmuCoreSightPerformDAPAcc(AccDescList);
    //
    // Prepare result
    //
    Results = new Uint32Array(Length).map((value, index) => {
      return AccDescList[index + 1].Data;
    });
    AccDescList = null; // Let gargabe collector take this
    return Results;
  }

  /*****************************************************
  * WriteMem32(): Write one or multiple 32-bit values to target. Specify data as Uint32Array
  */
  async function WriteMem32(Addr, aData) {
    var AccDescList;
    var Results;
    var i;
    //
    // Fill the job array with write jobs.
    // However, 'fill' will copy the reference, so we use a different approach
    //
    LogOut("Write " + (aData.length * 4) + " bytes to " + ToHexString(Addr, true));
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
    await EmuCoreSightPerformDAPAcc(AccDescList);
  }


  /*********************************************************************
  *
  *       Internal functions
  *
  **********************************************************************
  */

  async function ConnectTarget() {
    var Vcc;
    var IdCode;
    var MaxTransferSize;

    LogOut("Start connecting to target");

    //
    // These MUST(!!!!) be the very first commands to J-Link, to be backward compatible to some older probes.
    // Never, absolutely NEVER change 
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
    aDataDown = new Uint8Array([EMU_CMD_GET_VERSION]);
    _ActiveCmd.NumBytesReceived = 0;
    _USBPort.Send(aDataDown, null, EventUSBOnSendError);   // Queue write
    aBuf = await USBRead(2);                        // Receive <Len> from J-Link (Implicitly waits for previous send() to finish before starting receive)
    v = Load16LE(aBuf, 0);                          // Load <Len>
    FWStr = await USBRead(v);                       // Receive FW string
    //
    // EMU_CMD_GET_CAPS
    // H->E 1-byte           <Cmd>
    // H<-E 4-byte           <Caps>
    //
    aDataDown = new Uint8Array([EMU_CMD_GET_CAPS]);
    _ActiveCmd.NumBytesReceived = 0;
    _USBPort.Send(aDataDown, null, EventUSBOnSendError);   // Queue write
    aBuf = await USBRead(4);                        // Receive <Caps> from J-Link (Implicitly waits for previous send() to finish before starting receive)
    _Caps = Load32LE(aBuf, 0);
    //
    // EMU_CMD_GET_CAPS_EX
    // H->E 1-byte           <Cmd>
    // H<-E 32-byte          <CapsEx>
    //
    aDataDown = new Uint8Array([EMU_CMD_GET_CAPS_EX]);
    _ActiveCmd.NumBytesReceived = 0;
    _USBPort.Send(aDataDown, null, EventUSBOnSendError);    // Queue write
    aBuf = await USBRead(32);                       // Receive <Caps> from J-Link (Implicitly waits for previous send() to finish before starting receive)
    _aCapsEx = aBuf.slice();
    //
    // Current J-Links support a "MaxTransactionSize" setting.
    // determines when NULL packets are not sent.
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
    if (IsEmuHasCapEx(EMU_CAP_EX_SET_EMU_OPTION) == true) {
      MaxTransferSize = 2048;           				  // 2K mode
      aDataDown       = new Uint8Array(1 + 4 + 4 + 2 + 6);
      Store8LE (aDataDown, 0, EMU_CMD_SET_EMU_OPTION);
      Store32LE(aDataDown, 1, 5);                      // Option == SET_MAX_TRANSFER_SIZE
      Store32LE(aDataDown, 5, MaxTransferSize);
      Store16LE(aDataDown, 9, 0);                      // Dummy handle == 0 as it is not needed for <OptionType>
      Store8LE (aDataDown, 11,0);                      // Dummy
      Store8LE (aDataDown, 12,0);                      // Dummy
      Store8LE (aDataDown, 13,0);                      // Dummy
      Store8LE (aDataDown, 14,0);                      // Dummy
      Store8LE (aDataDown, 15,0);                      // Dummy
      Store8LE (aDataDown, 16,0);                      // Dummy
      _ActiveCmd.NumBytesReceived = 0;
      _USBPort.Send(aDataDown, null, EventUSBOnSendError);    // Queue write
      aBuf = await USBRead(4);                                     // Receive <Response>
      _USBPort.SetMaxTransferSize(MaxTransferSize);
      //
      // EMU_CMD_GET_VERSION
      // H->E 1-byte           <Cmd>
      // H<-E 2-byte           <Len>
      // H<-E x-byte           <Len> bytes <FWString>
      //
      aDataDown = new Uint8Array([EMU_CMD_GET_VERSION]);
      _ActiveCmd.NumBytesReceived = 0;
      _USBPort.Send(aDataDown, null, EventUSBOnSendError);   // Queue write
      aBuf = await USBRead(2);                         // Receive <Len> from J-Link (Implicitly waits for previous send() to finish before starting receive)
      v = Load16LE(aBuf, 0);                           // Load <Len>
      FWStr = await USBRead(v);                        // Receive FW string
      s = ByteArrayToASCIIString(FWStr);
      LogOut("FW Version = " + s);
      //
      // Register host process @ J-Link
      //
      Vcc = await UpdateConTable(REG_CMD_REGISTER);
      Vcc /= 1000;
      //
      // Select TIF == SWD
      // H->E 1-byte           <Cmd>
      // H->E 1-byte           <SubCmd>
      // H<-E 4-byte           <Response> (U32: Previously selected TIF)
      //
      aDataDown = new Uint8Array(1 + 1);
      Store8LE(aDataDown, 0, EMU_CMD_HW_SELECT_IF);
      Store8LE(aDataDown, 1, JLINK_TIF_SWD);
      _USBPort.Send(aDataDown, null, EventUSBOnSendError); // Queues write
      aBuf = await USBRead(4);                          // Receive <Len> from J-Link (Implicitly waits for previous send() to finish before starting receive)
      //
      // Select TIF speed == 4000 kHz
      // H->E 1-byte           <Cmd>
      // H->E 2-byte           <Speed_kHz> (0xFFFF has special meaning: Adaptive clocking)
      // No response from J-Link to command!
      //
      Speed = 4000;  // Select 4 MHz
      aDataDown = new Uint8Array(1 + 2);
      Store8LE (aDataDown, 0, EMU_CMD_SET_SPEED);
      Store16LE(aDataDown, 1, Speed);
      _USBPort.Send(aDataDown, null, EventUSBOnSendError); // Queues write and waits until it is complete
      //
      // Init CORESIGHT module on J-Link for further use
      //
      await EmuCoreSightConfigure("");
      //
      // Request ID Code
      //
      IdCode = await CoreSightReadDP(JLINK_CORESIGHT_DP_REG_IDCODE);
      LogOut("IDCODE = " + " 0x" + IdCode.toString(16).toUpperCase());
      LogOut("VCC    = " + Vcc + "V");
      //
      // InitDAP
      //
      await InitDAP();
      
      // Done
      LogOut("Connect finished");
    }
  }

  /*****************************************************
  * EventUSBOnSendError(): Define what need to be done when failed sending
  *   Value: Error value
  */
  function EventUSBOnSendError(Value) {
    EventOnError("USB send error: " + Value.status);
  }

  /*****************************************************
  * USBRead(): Read from USB port
  *   NumBytes: number of bytes to read
  */
  async function USBRead(NumBytes) {
    //
    // Read data from J-Link until <NumBytes> request is fulfilled.
    // We may get more bytes from J-Link as requested in call, so we need to buffer that for a subsequent _USB_Read() call
    // that then can feed the caller from the buffer instead of triggering another USB transaction.
    //
    // The idea is that the backend does large USB transfers to improve performance
    // but the application part can still request single bytes etc. that may be fed from an intermediate buffer.
    //
    while (_ActiveCmd.NumBytesReceived < NumBytes) {
      await _USBPort.Receive(EventUSBOnRecv, EventUSBOnRecvError); // Schedule read + wait until read is complete
    }
    //
    // Copy from global buffer into local one and return requested data to caller
    //
    Slice = _aDataBuf.slice(0, NumBytes);    // Extract received data into separate buffer we pass to caller
    _aDataBuf = _aDataBuf.slice(NumBytes);   // Move remaining data to start of array
    _ActiveCmd.NumBytesReceived -= NumBytes; // Correct buffer fill state marker
    return Slice;
  }

  /*****************************************************
  * EventUSBOnRecvError(): Define what need to be done when failed receiving
  *   error: Error message
  */
  function EventUSBOnRecvError(error) {
    EventOnError("USB receive error: " + error);
  }

  /*****************************************************
  * EventUSBOnRecv(): USB Port receiving event. Using with SeggerBulk.Receive().
  *   data: received data
  */
  function EventUSBOnRecv(data) {
    var aDataTmp;
    //
    // The WebUSB API passes a <USBInTransferResult> object to callback, on data reception.
    // https://wicg.github.io/webusb/#usbintransferresult
    // object has 2 readonly members:
    //   <data> of type DataView
    //   <status> of type USBTransferStatus
    // USBTransferStatus is an "enum" that may have one of the following values: "ok" / "stall" / "babble"
    //
    data = data.data; // We are only interested in the DataView part of the response
    //
    // Early out on NULL packet reception
    //
    if (data.byteLength == 0) {  // NULL packet received? => Early out
      return;
    }
    LogOut("Received " + data.byteLength + " bytes");
    //
    // Add received data to the intermediate buffer.
    // If is the 1st receive for the given command, make sure that we allocate a buffer
    //
    if (_ActiveCmd.NumBytesReceived) {                      // Already data in the buffer? => Concatenate
      LogOut("Concat " + data.byteLength + " bytes");
      aDataTmp = new Uint8Array(data.buffer);               // Convert stream to U8 array
      _aDataBuf = ConcatTypedArrays(_aDataBuf, aDataTmp);  // Extend existing buffer and add bytes to it
    } else {                                                // 1st receive? => Create buffer
      LogOut("Copy " + data.byteLength + " bytes");
      _aDataBuf = new Uint8Array(data.buffer);              // Copy data into new tmp array
    }
    //
    // Increment buffer count.
    // _USB_Read() will schedule another read if necessary (not all bytes expected have been received yet).
    //
    _ActiveCmd.NumBytesReceived += data.byteLength;
  }

  /*****************************************************
  * EventOnError(): Define what need to be done when failed communication
  *   error: error message string to log
  */
  function EventOnError(error) {
    // Log error
    LogOut(error);
    // Disconnect
    UsbDisConnect();
  }

  /*****************************************************
  * IsEmuHasCapEx(): Check if emulator has the specified extended capability
  */
  function IsEmuHasCapEx(CapEx) {
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

  /*****************************************************
  * UpdateConTable(): Register/Unregister the connection with the J-Link.
  */
  async function UpdateConTable(SubCmd) {
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

    LogOut(((SubCmd == REG_CMD_REGISTER) ? "Register" : "Unregister") + " host @ J-Link");
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
    Store8LE (aDataDown,  0, EMU_CMD_REGISTER);  // <Cmd>
    Store8LE (aDataDown,  1, SubCmd);                     // <SubCmd>
    Store32LE(aDataDown,  2, _MAIN_PIDx);        // <PIDx>
    Store32LE(aDataDown,  6, _MAIN_HostId);      // <HID>
    Store8LE (aDataDown, 10, 0);                          // <IID>
    Store8LE (aDataDown, 11, 0);                          // <CID>
    Store16LE(aDataDown, 12, Handle);                     // <Handle>
    _ActiveCmd.NumBytesReceived = 0;
    _USBPort.Send(aDataDown, null, EventUSBOnSendError); // Queue write
    NumBytesExpected = 12 + (4 * 16);
    aBuf = await USBRead(NumBytesExpected);
    Handle        = Load16LE(aBuf, 0);                 // Handle
    NumConInfos   = Load16LE(aBuf, 2);                 // NumConInfos
    SizeOfConInfo = Load16LE(aBuf, 4);                 // SizeOfConInfo
    NumBytesAdd   = Load16LE(aBuf, 6);                 // NumBytesAdd
    //
    // Retrieve additional connection infos
    //
    Len = 8 + (NumConInfos * SizeOfConInfo) + NumBytesAdd;
    if (Len > NumBytesExpected) {
      Len -= NumBytesExpected;
      aTempBuf = await USBRead(Len);
      aBuf = ConcatTypedArrays(aBuf, aTempBuf);
    }
    //
    // Extract list of connection infos
    //
    aTempConInfoList = new Array(NumConInfos);
    for (i = 0; i < NumConInfos; i++) {
      Pos = 8 + (i * SizeOfConInfo);
      aTempConInfoList[i] = {
        PID:    Load32LE(aBuf, Pos +  0),
        HID:    Load32LE(aBuf, Pos +  4),
        IID:    Load8LE (aBuf, Pos +  8),
        CID:    Load8LE (aBuf, Pos +  9),
        Handle: Load16LE(aBuf, Pos + 10),
        TSLast: Load32LE(aBuf, Pos + 12),
      }
    }
    _MAIN_Stat.aConInfo = aTempConInfoList;
    aTempConInfoList = null; // Let garbage collector take this
    //
    // Handle remaining data of response
    //
    Vcc = Load32LE(aBuf, aBuf.length - 4); // Ignore target VCC for now
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
      LogOut("Register failed.");
      return 0;
    }
    LogOut("Registration info:");
    LogOut("ConInfo Index: " + _MAIN_Stat.ConIndex);
    LogOut(JSON.stringify(_MAIN_Stat.aConInfo[_MAIN_Stat.ConIndex]));
    return Vcc;
  }

  /*****************************************************
  * EmuCoreSightConfigure(): Configure Coresight
  */
  async function EmuCoreSightConfigure(ConfigString) {
    var aDataDown;
    var aConfigCharArray;
  
    LogOut("Configure Coresight");
    if (IsEmuHasCapEx(EMU_CAP_EX_CORESIGHT_DAP_ACC) == false) {
      throw new Error("Emulator does not support configuration for low-level DAP access.");
    }
    aConfigCharArray = StringToByteArray(ConfigString);
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
    aDataDown = new Uint8Array(4 + 4);
    Store8LE (aDataDown, 0, EMU_CMD_CORESIGHT);
    Store8LE (aDataDown, 1, _MAIN_Stat.ConIndex);
    Store8LE (aDataDown, 2, EMU_CMD_CORESIGHT_CMD_CONFIG);
    Store8LE (aDataDown, 3, 0);                                 // Dummy
    Store32LE(aDataDown, 4, aConfigCharArray.length);
    aDataDown = ConcatTypedArrays(aDataDown, aConfigCharArray); // Append String to message
    aConfigCharArray = null;                                     // Let garbage collector take this
    _ActiveCmd.NumBytesReceived = 0;
    _USBPort.Send(aDataDown, null, EventUSBOnSendError);          // Queues write and waits until it is complete
    aBuf = await USBRead(4);
    //
    // Check response
    //
    if (Load32LE(aBuf, 0)) {
      throw new Error("Coresight configuration with '" + ConfigString + "' failed.");
    }
  }

  /*****************************************************
  * InitDAP(): Initialize DAP
  */
  async function InitDAP() {
    var AccDescList;
    const APConfig = (2 <<  0)      // Access size: word
                   | (1 <<  4)      // No auto increment
                   | (1 << 24)      // Reserved
                   | (1 << 25)      // Private access
                   | (1 << 29)      // MasterType == Debug
                   ;
  
    LogOut("Initialize DAP");
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
        // bit does not get set but the DAP is fully usable though.
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
    await EmuCoreSightPerformDAPAcc(AccDescList);
  }

  /*****************************************************
  * EmuCoreSightPerformDAPAcc(): Perform DAP access
  *   Complete job sequence must not take longer than 5 seconds, otherwise will lead to USB communication timeouts on the J-Link side.
  *   Usually, timeouts for a single "ReadDAPUntilMaskMatch" should be in the league of <= 100ms.
  */
  async function EmuCoreSightPerformDAPAcc(paAccDesc) {
    const HEADER_SIZE    = 4+4;
    const ACC_DESC_SIZE  = 20;
    const RESP_SIZE = 8;
    var NumEntries;
    var SplitNumEntries;
    var DataDownSize;
    var aDataDown;
    var Pos;
    var i;

    LogOut("Coresight DAP accesss (" + paAccDesc.length + " times)");
    if (IsEmuHasCapEx(EMU_CAP_EX_CORESIGHT_DAP_ACC) == false) {
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
      await EmuCoreSightPerformDAPAcc(paAccDesc.slice(0, SplitNumEntries));
      await EmuCoreSightPerformDAPAcc(paAccDesc.slice(SplitNumEntries, (NumEntries + 1)));
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
    aDataDown = new Uint8Array(DataDownSize);
    Store8LE (aDataDown, 0, EMU_CMD_CORESIGHT);
    Store8LE (aDataDown, 1, _MAIN_Stat.ConIndex);
    Store8LE (aDataDown, 2, EMU_CMD_CORESIGHT_CMD_DAP_ACC);
    Store8LE (aDataDown, 3, 0);                                             // Dummy for alignment
    Store32LE(aDataDown, 4, NumEntries);
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
      Store32LE(aDataDown, Pos, paAccDesc[i].Data);               Pos += 4;
      Store32LE(aDataDown, Pos, paAccDesc[i].Mask);               Pos += 4;
      Store32LE(aDataDown, Pos, paAccDesc[i].CompVal);            Pos += 4;
      Store32LE(aDataDown, Pos, paAccDesc[i].TimeoutMsReadUntil); Pos += 4;
      Store8LE (aDataDown, Pos, paAccDesc[i].RegIndex);           Pos += 1;
      Store8LE (aDataDown, Pos, paAccDesc[i].APnDP);              Pos += 1;
      Store8LE (aDataDown, Pos, paAccDesc[i].RnW);                Pos += 1;
      Store8LE (aDataDown, Pos, 0);                               Pos += 1; // Dummy for alignment
    }
    _ActiveCmd.NumBytesReceived = 0;
    _USBPort.Send(aDataDown, null, EventUSBOnSendError);                      // Queues write and waits until it is complete
    aBuf = await USBRead(NumEntries * RESP_SIZE);
    //
    // Store result
    //
    for (i = 0; i < NumEntries; i++) {
      paAccDesc[i].Status = Load32LE(aBuf, (i * 8));
      if (paAccDesc[i].RnW) {
        paAccDesc[i].Data   = Load32LE(aBuf, (i * RESP_SIZE) + 4);
      }
      LogOut((paAccDesc[i].APnDP ? "AP" : "DP") + " " + (paAccDesc[i].RnW ? "read" : "write"));
      LogOut(" Register: " + paAccDesc[i].RegIndex);
      LogOut(" Status: " + paAccDesc[i].Status);
      LogOut(" Data:  " + ToHexString(paAccDesc[i].Data, true));
    }
  }

  /*****************************************************
  * LogOut(): Log debug message to browser console. Nothing happen when _DEBUG = _DEBUG_DISABLE
  *   sLog: message string to log
  */
  function LogOut(sLog) {
    if (_DEBUG == _DEBUG_SIMP || _DEBUG == _DEBUG_FULL) {
      var PreStr = "";
      if (_DEBUG == _DEBUG_FULL) {
        PreStr = new Date().getTime().toString() + " - " + LogOut.caller.name + ": ";
      }
      PreStr = PreStr + sLog;
      console.log(PreStr);
    }
  }

  /*****************************************************
  * ConcatTypedArrays()
  */
  function ConcatTypedArrays(a, b) { // a, b TypedArray of same type
    var c;
  
    c = new (a.constructor)(a.length + b.length);
    c.set(a, 0);
    c.set(b, a.length);
    return c;
  }

  /*****************************************************
  * Store8LE(): Converts an U8 parameter to a byte array
  */
  function Store8LE(aByte, Pos, Val) {
    new DataView(aByte.buffer).setUint8(Pos, Val);
  }
  
  /*****************************************************
  * Store16LE(): Converts an U16 parameter to a byte array
  */
  function Store16LE(aByte, Pos, Val) {
    new DataView(aByte.buffer).setUint16(Pos, Val, true);
  }

  /*****************************************************
  * Store32LE(): Converts an U32 parameter to a byte array
  */
  function Store32LE(aByte, Pos, Val) {
    new DataView(aByte.buffer).setUint32(Pos, Val, true);
  }

  /*****************************************************
  * Load8LE(): Reads an U8 parameter from a byte array
  */
  function Load8LE(aByte, Pos) {
    return new DataView(aByte.buffer).getUint8(Pos, true);
  }
  
  /*****************************************************
  * Load16LE(): Reads an U16 parameter from a byte array
  */
  function Load16LE(aByte, Pos) {
    return new DataView(aByte.buffer).getUint16(Pos, true);
  }

  /*****************************************************
  * Load32LE(): Reads an U32 parameter from a byte array
  */
  function Load32LE(aByte, Pos) {
    return new DataView(aByte.buffer).getUint32(Pos, true);
  }

  /*****************************************************
  * ByteArrayToASCIIString(): Converts U8 byte array into a String
  */
  function ByteArrayToASCIIString(aByteArray) {
    var i;
    var Slice;
  
    i = aByteArray.indexOf(0);
    Slice = aByteArray.slice(0, i);
    return new TextDecoder().decode(Slice);
  }

  /*****************************************************
  * StringToByteArray(): Converts a String into an U8 byte array
  */
  function StringToByteArray(Text) {
    return new TextEncoder().encode(Text + "\0");
  }

  /*****************************************************
  * ToHexString(): Converts a decimal number into an hexa string
  */
  function ToHexString(num, hasPrefix) {
    return (hasPrefix ? "0x" : "") + num.toString(16).padStart(8, "0").toUpperCase();
  }