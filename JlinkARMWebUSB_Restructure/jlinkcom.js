var JlinkCom = {
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
  _DEBUG_DISABLE: 0,
  // Simple Debug mode (Simple log - displayed only message on the console)
  _DEBUG_SIMP: 1,
  // Full Debug mode (Message and target caller displayed on the browser console)
  _DEBUG_FULL: 2,

  _DEBUG: 2,

  /*****************************************************
  * _MAIN_Stat: Communication status
  */
  _MAIN_Stat: null,
  /*****************************************************
  * _IsConnected: Connection status
  */
  _IsConnected: 0,
  /*****************************************************
  * _USBPort: USB Port of J-Link
  */
  _USBPort: null,
  /*****************************************************
  * _ActiveCmd: Active Command on USB port
  */
  _ActiveCmd: { NumBytesReceived: 0 },
  /*****************************************************
  * _Caps: J-Link capabilities
  */
  _Caps: null,
  /*****************************************************
  * _aCapsEx: J-Link extended capabilities
  */
  _aCapsEx: null,


  /*********************************************************************
  *
  *       Defines. DO NOT CHANGE
  *
  **********************************************************************
  */
  //
  // J-Link USB commands
  //
  EMU_CMD_SET_EMU_OPTION: 0x0E,
  EMU_CMD_CORESIGHT: 0x1A,
  EMU_CMD_GET_VERSION: 0x01,
  EMU_CMD_GET_CAPS: 0xE8,
  EMU_CMD_GET_CAPS_EX: 0xED,
  EMU_CMD_REGISTER: 0x09,
  EMU_CMD_GET_PROBE_INFO_CMD_GET_CAPS: 0,
  EMU_CMD_CORESIGHT_CMD_CONFIG: 0,
  EMU_CMD_CORESIGHT_CMD_DAP_ACC: 1,
  EMU_CMD_GET_PROBE_INFO: 28,
  EMU_CMD_HW_SELECT_IF: 0xC7,
  EMU_CMD_SET_SPEED: 0x05,
  EMU_PROBE_INFO_SUB_CMD_WRITE_MSD_IMG_CHUNK: 5,
  EMU_PROBE_INFO_SUB_CMD_WRITE_MSD_IMG_END: 6,
  //
  // JLINK target interface settings
  //
  JLINK_TIF_JTAG: 0x00,
  JLINK_TIF_SWD: 0x01,
  //
  // J-Link USB capabilities
  //
  EMU_CAP_RESERVED: (1 << 0),
  EMU_CAP_GET_HW_VERSION: (1 << 1),
  EMU_CAP_WRITE_DCC: (1 << 2),
  EMU_CAP_ADAPTIVE_CLOCKING: (1 << 3),
  EMU_CAP_READ_CONFIG: (1 << 4),
  EMU_CAP_WRITE_CONFIG: (1 << 5),
  EMU_CAP_TRACE: (1 << 6),
  EMU_CAP_WRITE_MEM: (1 << 7),
  EMU_CAP_READ_MEM: (1 << 8),
  EMU_CAP_SPEED_INFO: (1 << 9),
  EMU_CAP_EXEC_CODE: (1 << 10),
  EMU_CAP_GET_MAX_BLOCK_SIZE: (1 << 11),
  EMU_CAP_GET_HW_INFO: (1 << 12),
  EMU_CAP_SET_KS_POWER: (1 << 13),
  EMU_CAP_RESET_STOP_TIMED: (1 << 14),
  EMU_CAP_SHORTEN_LIFE: (1 << 15),
  EMU_CAP_MEASURE_RTCK_REACT: (1 << 16),
  EMU_CAP_SELECT_IF: (1 << 17),
  EMU_CAP_RW_MEM_ARM79: (1 << 18),
  EMU_CAP_GET_COUNTERS: (1 << 19),
  EMU_CAP_READ_DCC: (1 << 20),
  EMU_CAP_GET_CPU_CAPS: (1 << 21),
  EMU_CAP_EXEC_CPU_CMD: (1 << 22),
  EMU_CAP_SWO: (1 << 23),
  EMU_CAP_WRITE_DCC_EX: (1 << 24),
  EMU_CAP_UPDATE_FIRMWARE_EX: (1 << 25),
  EMU_CAP_FILE_IO: (1 << 26),
  EMU_CAP_REGISTER: (1 << 27),
  EMU_CAP_INDICATORS: (1 << 28),
  EMU_CAP_TEST_NET_SPEED: (1 << 29),
  EMU_CAP_RAWTRACE: (1 << 30),
  EMU_CAP_GET_CAPS_EX: (1 << 31),
  //
  // J-Link USB extended capabilities
  //
  EMU_CAP_EX_SET_EMU_OPTION: 46,           // Supports command "EMU_CMD_SET_EMU_OPTION"
  EMU_CAP_EX_CORESIGHT_DAP_ACC: 62,
  EMU_CAP_EX_GET_PROBE_INFO: 64,           // Supports EMU_CMD_GET_PROBE_INFO
  //
  // Caps for EMU_CMD_GET_PROBE_INFO
  //
  EMU_PROBE_INFO_CAP_MSD_IMG: 2,
  //
  // Register sub commands
  //
  REG_CMD_REGISTER: 100,
  REG_CMD_UNREGISTER: 101,
  //
  // CoreSight Register
  //
  JLINK_CORESIGHT_WRITE: 0,
  JLINK_CORESIGHT_READ: 1,
  JLINK_CORESIGHT_DP: 0,
  JLINK_CORESIGHT_AP: 1,
  JLINK_CORESIGHT_DP_REG_IDCODE: 0,
  JLINK_CORESIGHT_DP_REG_ABORT: 0,
  JLINK_CORESIGHT_DP_REG_CTRL_STAT: 1,
  JLINK_CORESIGHT_DP_REG_SELECT: 2,
  JLINK_CORESIGHT_DP_REG_RDBUF: 3,
  JLINK_CORESIGHT_AP_REG_CTRL: 0,          // CSW register
  JLINK_CORESIGHT_AP_REG_ADDR: 1,
  JLINK_CORESIGHT_AP_REG_DATA: 3,
  //
  // Host settings
  //
  _MAIN_PIDx: 0xAB,
  _MAIN_HostId: 0xCD,
  _MAX_DAP_JOB_SIZE: 0x400,

  UsbConnect: async function () {

    // Reset MAIN Stats
    this._MAIN_Stat = {
      NumConnections: 0,
      ConIndex: -1,
      aConInfo: [],
    }
    // Create new USB Port
    this.LogOut("Connect to USB port");
    if (this._IsConnected === 0) {
      this._USBPort = SeggerBulk; // Create a new instance of SeggerBulk only if none has been created so far
    }
    await SeggerBulk.Connect();                      // Schedules asynchronous connect + waits for it to complete
    this._IsConnected = 1;
    // Check if already connected or not

    // Connect target
    await this.ConnectTarget();
  },
  LogOut(sLog) {
    // if (this._DEBUG == this._DEBUG_SIMP || this._DEBUG == this._DEBUG_FULL) {
    //   var PreStr = "";
    //   if (this._DEBUG == this._DEBUG_FULL) {
    //     // PreStr = new Date().getTime().toString() + " - " + JlinkCom.LogOut.caller.name + ": ";
    //     PreStr = new Date().getTime().toString() + " - " + ": ";;
    //   }
    //   PreStr = PreStr + sLog;
    //   console.log(PreStr);
    // }
  },
  /*****************************************************
* ByteArrayToASCIIString(): Converts U8 byte array into a String
*/
  ByteArrayToASCIIString: function (aByteArray) {
    var i;
    var Slice;

    i = aByteArray.indexOf(0);
    Slice = aByteArray.slice(0, i);
    return new TextDecoder().decode(Slice);
  },
  EventOnError(error) {
    // Log error
    this.LogOut(error);
    // Disconnect
    this.UsbDisConnect();
  },
  /*****************************************************
* EventUSBOnSendError(): Define what need to be done when failed sending
*   Value: Error value
*/
  EventUSBOnSendError: function (Value) {
    JlinkCom.EventOnError("USB send error: " + Value.status);
  },

  UsbDisConnect: async function () {
    // Unregister hots process from J-Link
    await this.UpdateConTable(this.REG_CMD_UNREGISTER);
    // Disconnect from USB Port
    if (this._IsConnected) {
      this._USBPort.Disconnect();
      this.LogOut("Disconnected from USB device");
    }

    // Reset const
    this._IsConnected = 0;
    this._USBPort = null;
    this._ActiveCmd.NumBytesReceived = 0;
    this._MAIN_Stat = null
  },
  /*****************************************************
* ConcatTypedArrays()
*/
  ConcatTypedArrays: function (a, b) { // a, b TypedArray of same type
    var c;
    c = new (a.constructor)(a.length + b.length);
    c.set(a, 0);
    c.set(b, a.length);
    return c;
  },
  /*****************************************************
  * Store8LE(): Converts an U8 parameter to a byte array
  */
  Store8LE: function (aByte, Pos, Val) {
    new DataView(aByte.buffer).setUint8(Pos, Val);
  },

  /*****************************************************
  * Store16LE(): Converts an U16 parameter to a byte array
  */
  Store16LE: function (aByte, Pos, Val) {
    new DataView(aByte.buffer).setUint16(Pos, Val, true);
  },

  /*****************************************************
  * Store32LE(): Converts an U32 parameter to a byte array
  */
  Store32LE: function (aByte, Pos, Val) {
    new DataView(aByte.buffer).setUint32(Pos, Val, true);
  },

  /*****************************************************
  * Load8LE(): Reads an U8 parameter from a byte array
  */
  Load8LE: function (aByte, Pos) {
    return new DataView(aByte.buffer).getUint8(Pos, true);
  },

  /*****************************************************
  * Load16LE(): Reads an U16 parameter from a byte array
  */
  Load16LE: function (aByte, Pos) {
    return new DataView(aByte.buffer).getUint16(Pos, true);
  },

  /*****************************************************
  * Load32LE(): Reads an U32 parameter from a byte array
  */
  Load32LE: function (aByte, Pos) {
    return new DataView(aByte.buffer).getUint32(Pos, true);
  },
  /*****************************************************
* IsEmuHasCapEx(): Check if emulator has the specified extended capability
*/
  IsEmuHasCapEx: function (CapEx) {
    var Byte;
    var Bit;

    if (this._aCapsEx == null) {
      return false;
    }
    Byte = CapEx >> 3;
    Bit = CapEx & 7;
    if (this._aCapsEx[Byte] & (1 << Bit)) {
      return true;
    }
    return false;
  },
  /*****************************************************
* UpdateConTable(): Register/Unregister the connection with the J-Link.
*/
  UpdateConTable: async function (SubCmd) {
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

    this.LogOut(((SubCmd == this.REG_CMD_REGISTER) ? "Register" : "Unregister") + " host @ J-Link");
    if ((this._Caps & this.EMU_CAP_REGISTER) == 0) {
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
    Handle = 0;                    // Not registered yet
    aDataDown = new Uint8Array(1 + 1 + 4 + 4 + 1 + 1 + 2);
    this.Store8LE(aDataDown, 0, this.EMU_CMD_REGISTER);  // <Cmd>
    this.Store8LE(aDataDown, 1, SubCmd);                     // <SubCmd>
    this.Store32LE(aDataDown, 2, this._MAIN_PIDx);        // <PIDx>
    this.Store32LE(aDataDown, 6, this._MAIN_HostId);      // <HID>
    this.Store8LE(aDataDown, 10, 0);                          // <IID>
    this.Store8LE(aDataDown, 11, 0);                          // <CID>
    this.Store16LE(aDataDown, 12, Handle);                     // <Handle>
    JlinkCom._ActiveCmd.NumBytesReceived = 0;
    this._USBPort.Send(aDataDown, null, this.EventUSBOnSendError); // Queue write
    NumBytesExpected = 12 + (4 * 16);
    aBuf = await this.USBRead(NumBytesExpected);
    Handle = this.Load16LE(aBuf, 0);                 // Handle
    NumConInfos = this.Load16LE(aBuf, 2);                 // NumConInfos
    SizeOfConInfo = this.Load16LE(aBuf, 4);                 // SizeOfConInfo
    NumBytesAdd = this.Load16LE(aBuf, 6);                 // NumBytesAdd
    //
    // Retrieve additional connection infos
    //
    Len = 8 + (NumConInfos * SizeOfConInfo) + NumBytesAdd;
    if (Len > NumBytesExpected) {
      Len -= NumBytesExpected;
      aTempBuf = await this.USBRead(Len);
      aBuf = this.ConcatTypedArrays(aBuf, aTempBuf);
    }
    //
    // Extract list of connection infos
    //
    aTempConInfoList = new Array(NumConInfos);
    for (i = 0; i < NumConInfos; i++) {
      Pos = 8 + (i * SizeOfConInfo);
      aTempConInfoList[i] = {
        PID: this.Load32LE(aBuf, Pos + 0),
        HID: this.Load32LE(aBuf, Pos + 4),
        IID: this.Load8LE(aBuf, Pos + 8),
        CID: this.Load8LE(aBuf, Pos + 9),
        Handle: this.Load16LE(aBuf, Pos + 10),
        TSLast: this.Load32LE(aBuf, Pos + 12),
      }
    }
    this._MAIN_Stat.aConInfo = aTempConInfoList;
    aTempConInfoList = null; // Let garbage collector take this
    //
    // Handle remaining data of response
    //
    Vcc = this.Load32LE(aBuf, aBuf.length - 4); // Ignore target VCC for now
    //
    // Find our newly registered connection in the list of connections
    //
    NumConnections = 0;
    ConIndex = -1;
    for (i = 0; i < this._MAIN_Stat.aConInfo.length; i++) {
      if (this._MAIN_Stat.aConInfo[i].Handle) {
        if ((this._MAIN_Stat.aConInfo[i].PID == this._MAIN_PIDx) && (this._MAIN_Stat.aConInfo[i].HID == this._MAIN_HostId) && (this._MAIN_Stat.aConInfo[i].Handle == Handle)) {
          ConIndex = i;
        }
        NumConnections++;
      }
    }
    this._MAIN_Stat.NumConnections = NumConnections;
    this._MAIN_Stat.ConIndex = ConIndex;
    //
    // Check if J-Link has accepted the register
    //
    if ((SubCmd == this.REG_CMD_REGISTER) && (ConIndex < 0)) {
      this.LogOut("Register failed.");
      return 0;
    }
    this.LogOut("Registration info:");
    this.LogOut("ConInfo Index: " + this._MAIN_Stat.ConIndex);
    this.LogOut(JSON.stringify(this._MAIN_Stat.aConInfo[this._MAIN_Stat.ConIndex]));
    return Vcc;
  },
  ConnectTarget: async function () {
    var Vcc;
    var IdCode;
    var MaxTransferSize;

    this.LogOut("Start connecting to target");

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
    aDataDown = new Uint8Array([this.EMU_CMD_GET_VERSION]);
    this._ActiveCmd.NumBytesReceived = 0;
    this._USBPort.Send(aDataDown, null, this.EventUSBOnSendError);   // Queue write
    aBuf = await this.USBRead(2);                        // Receive <Len> from J-Link (Implicitly waits for previous send() to finish before starting receive)
    v = this.Load16LE(aBuf, 0);                          // Load <Len>
    FWStr = await this.USBRead(v);                       // Receive FW string
    //
    // EMU_CMD_GET_CAPS
    // H->E 1-byte           <Cmd>
    // H<-E 4-byte           <Caps>
    //
    aDataDown = new Uint8Array([this.EMU_CMD_GET_CAPS]);
    this._ActiveCmd.NumBytesReceived = 0;
    this._USBPort.Send(aDataDown, null, this.EventUSBOnSendError);   // Queue write
    aBuf = await this.USBRead(4);                        // Receive <Caps> from J-Link (Implicitly waits for previous send() to finish before starting receive)
    this._Caps = this.Load32LE(aBuf, 0);
    //
    // EMU_CMD_GET_CAPS_EX
    // H->E 1-byte           <Cmd>
    // H<-E 32-byte          <CapsEx>
    //
    aDataDown = new Uint8Array([this.EMU_CMD_GET_CAPS_EX]);
    this._ActiveCmd.NumBytesReceived = 0;
    this._USBPort.Send(aDataDown, null, this.EventUSBOnSendError);    // Queue write
    aBuf = await this.USBRead(32);                       // Receive <Caps> from J-Link (Implicitly waits for previous send() to finish before starting receive)
    this._aCapsEx = aBuf.slice();
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
    if (this.IsEmuHasCapEx(this.EMU_CAP_EX_SET_EMU_OPTION) == true) {
      MaxTransferSize = 2048;           				  // 2K mode
      aDataDown = new Uint8Array(1 + 4 + 4 + 2 + 6);
      this.Store8LE(aDataDown, 0, this.EMU_CMD_SET_EMU_OPTION);
      this.Store32LE(aDataDown, 1, 5);                      // Option == SET_MAX_TRANSFER_SIZE
      this.Store32LE(aDataDown, 5, MaxTransferSize);
      this.Store16LE(aDataDown, 9, 0);                      // Dummy handle == 0 as it is not needed for <OptionType>
      this.Store8LE(aDataDown, 11, 0);                      // Dummy
      this.Store8LE(aDataDown, 12, 0);                      // Dummy
      this.Store8LE(aDataDown, 13, 0);                      // Dummy
      this.Store8LE(aDataDown, 14, 0);                      // Dummy
      this.Store8LE(aDataDown, 15, 0);                      // Dummy
      this.Store8LE(aDataDown, 16, 0);                      // Dummy
      this._ActiveCmd.NumBytesReceived = 0;
      this._USBPort.Send(aDataDown, null, this.EventUSBOnSendError);    // Queue write
      aBuf = await this.USBRead(4);                                     // Receive <Response>
      this._USBPort.SetMaxTransferSize(MaxTransferSize);
      //
      // EMU_CMD_GET_VERSION
      // H->E 1-byte           <Cmd>
      // H<-E 2-byte           <Len>
      // H<-E x-byte           <Len> bytes <FWString>
      //
      aDataDown = new Uint8Array([this.EMU_CMD_GET_VERSION]);
      this._ActiveCmd.NumBytesReceived = 0;
      this._USBPort.Send(aDataDown, null, this.EventUSBOnSendError);   // Queue write
      aBuf = await this.USBRead(2);                         // Receive <Len> from J-Link (Implicitly waits for previous send() to finish before starting receive)
      v = this.Load16LE(aBuf, 0);                           // Load <Len>
      FWStr = await this.USBRead(v);                        // Receive FW string
      s = this.ByteArrayToASCIIString(FWStr);
      JlinkCom.LogOut("FW Version = " + s);
      //
      // Register host process @ J-Link
      //
      Vcc = await this.UpdateConTable(this.REG_CMD_REGISTER);
      Vcc /= 1000;
      //
      // Select TIF == SWD
      // H->E 1-byte           <Cmd>
      // H->E 1-byte           <SubCmd>
      // H<-E 4-byte           <Response> (U32: Previously selected TIF)
      //
      aDataDown = new Uint8Array(1 + 1);
      this.Store8LE(aDataDown, 0, this.EMU_CMD_HW_SELECT_IF);
      this.Store8LE(aDataDown, 1, this.JLINK_TIF_SWD);
      this._USBPort.Send(aDataDown, null, this.EventUSBOnSendError); // Queues write
      aBuf = await this.USBRead(4);                          // Receive <Len> from J-Link (Implicitly waits for previous send() to finish before starting receive)
      //
      // Select TIF speed == 4000 kHz
      // H->E 1-byte           <Cmd>
      // H->E 2-byte           <Speed_kHz> (0xFFFF has special meaning: Adaptive clocking)
      // No response from J-Link to command!
      //
      Speed = 4000;  // Select 4 MHz
      aDataDown = new Uint8Array(1 + 2);
      this.Store8LE(aDataDown, 0, this.EMU_CMD_SET_SPEED);
      this.Store16LE(aDataDown, 1, Speed);
      this._USBPort.Send(aDataDown, null, this.EventUSBOnSendError); // Queues write and waits until it is complete
      //
      // Init CORESIGHT module on J-Link for further use
      //
      await this.EmuCoreSightConfigure("");
      //
      // Request ID Code
      //
      IdCode = await this.CoreSightReadDP(this.JLINK_CORESIGHT_DP_REG_IDCODE);
      this.LogOut("IDCODE = " + " 0x" + IdCode.toString(16).toUpperCase());
      this.LogOut("VCC    = " + Vcc + "V");
      //
      // InitDAP
      //
      await this.InitDAP();

      // Done
      this.LogOut("Connect finished");
    }
  },
  InitDAP: async function () {
    var AccDescList;
    const APConfig = (2 << 0)      // Access size: word
      | (1 << 4)      // No auto increment
      | (1 << 24)      // Reserved
      | (1 << 25)      // Private access
      | (1 << 29)      // MasterType == Debug
      ;

    this.LogOut("Initialize DAP");
    AccDescList = [
      { //
        // Clear AP error flags
        //
        Data: 0x1E,
        RegIndex: this.JLINK_CORESIGHT_DP_REG_ABORT,
        APnDP: this.JLINK_CORESIGHT_DP,
        RnW: 0,
      },
      { //
        // Set CSYSPWRUPREQ and CDBGPWRUPREQ
        //
        Data: ((1 << 30) | (1 << 28)),
        RegIndex: this.JLINK_CORESIGHT_DP_REG_CTRL_STAT,
        APnDP: this.JLINK_CORESIGHT_DP,
        RnW: 0,
      },
      { //
        // Wait for CSYSPWRUPACK to get set.
        // Also verify that xxxREQ bits got written correctly
        // Do not wait for SYSPWRUPACK to get set as on some chips under some circumstances,
        // bit does not get set but the DAP is fully usable though.
        //
        Data: 0,
        Mask: (0x7 << 28),
        CompVal: (0x7 << 28),
        TimeoutMsReadUntil: 100,
        RegIndex: this.JLINK_CORESIGHT_DP_REG_CTRL_STAT,
        APnDP: this.JLINK_CORESIGHT_DP,
        RnW: 1,
      },
      {
        //
        // Select AP and AP bank to be used.
        //
        Data: 0, // Select bank 0, index 0
        RegIndex: this.JLINK_CORESIGHT_DP_REG_SELECT,
        APnDP: this.JLINK_CORESIGHT_DP,
        RnW: 0,
      },
      {
        //
        // Perform "one-time" AP setup like access width to be used for memory accesses via the AP.
        //
        Data: APConfig,
        RegIndex: this.JLINK_CORESIGHT_AP_REG_CTRL,
        APnDP: this.JLINK_CORESIGHT_AP,
        RnW: 0,
      },
    ];
    await this.EmuCoreSightPerformDAPAcc(AccDescList);
  },
  EmuCoreSightConfigure: async function (ConfigString) {
    var aDataDown;
    var aConfigCharArray;

    this.LogOut("Configure Coresight");
    if (this.IsEmuHasCapEx(this.EMU_CAP_EX_CORESIGHT_DAP_ACC) == false) {
      throw new Error("Emulator does not support configuration for low-level DAP access.");
    }
    aConfigCharArray = this.StringToByteArray(ConfigString);
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
    this.Store8LE(aDataDown, 0, this.EMU_CMD_CORESIGHT);
    this.Store8LE(aDataDown, 1, this._MAIN_Stat.ConIndex);
    this.Store8LE(aDataDown, 2, this.EMU_CMD_CORESIGHT_CMD_CONFIG);
    this.Store8LE(aDataDown, 3, 0);                                 // Dummy
    this.Store32LE(aDataDown, 4, aConfigCharArray.length);
    aDataDown = this.ConcatTypedArrays(aDataDown, aConfigCharArray); // Append String to message
    aConfigCharArray = null;                                     // Let garbage collector take this
    this._ActiveCmd.NumBytesReceived = 0;
    this._USBPort.Send(aDataDown, null, this.EventUSBOnSendError);          // Queues write and waits until it is complete
    aBuf = await this.USBRead(4);
    //
    // Check response
    //
    if (this.Load32LE(aBuf, 0)) {
      throw new Error("Coresight configuration with '" + ConfigString + "' failed.");
    }
  },
  /*****************************************************
* CoreSightWriteDP(): Read DP
*/
  CoreSightReadDP: async function (RegIndex) {
    return await this.CoreSightReadDAP(RegIndex, this.JLINK_CORESIGHT_DP);
  },
  /*****************************************************
* CoreSightReadDAP(): Read DAP
*/
  CoreSightReadDAP: async function (RegIndex, ApnDP) {
    var AccDesc;
    AccDesc = {
      RegIndex: RegIndex,
      APnDP: ApnDP,
      RnW: this.JLINK_CORESIGHT_READ,
    };
    await this.EmuCoreSightPerformDAPAcc([AccDesc]);
    if (AccDesc.Status) {
      throw new Error("CoreSight read DAP failed: " + AccDesc);
    }
    return AccDesc.Data;
  },
  ReadMem32: async function (Addr, Length) {
    var AccDescList;
    var Results;
    var i;
    //
    // Fill the job array with read jobs.
    // However, 'fill' will copy the reference, so we use a different approach
    //
    this.LogOut("Read " + (Length * 4) + " bytes @" + this.ToHexString(Addr, true));
    AccDescList = new Array(Length + 1).fill(null).map(() => ({}));  // Defaults set by _EmuCoreSightPerformDAPAcc() will lead to ReadAP(3) (DATA register) accesses.
    //
    // Job[0] setups the memory address to access with the R/W memory operation.
    //
    AccDescList[0] = {
      Data: Addr,
      RegIndex: this.JLINK_CORESIGHT_AP_REG_ADDR,
      RnW: this.JLINK_CORESIGHT_WRITE,
    };
    await this.EmuCoreSightPerformDAPAcc(AccDescList);
    //
    // Prepare result
    //
    Results = new Uint32Array(Length).map((value, index) => {
      return AccDescList[index + 1].Data;
    });
    AccDescList = null; // Let gargabe collector take this
    return Results;
  },
  WriteMem32: async function (Addr, aData) {
    var AccDescList;
    var Results;
    var i;
    //
    // Fill the job array with write jobs.
    // However, 'fill' will copy the reference, so we use a different approach
    //
    this.LogOut("Write " + (aData.length * 4) + " bytes to " + this.ToHexString(Addr, true));
    AccDescList = new Array(aData.length + 1).fill(null).map(() =>
    ({ // Write data
      RnW: this.JLINK_CORESIGHT_WRITE,
    })
    );
    //
    // Job[0] setups the memory address to access with the R/W memory operation.
    //
    AccDescList.map((obj, index) => {
      if (index == 0) {
        obj.Data = Addr;
        obj.RegIndex = this.JLINK_CORESIGHT_AP_REG_ADDR;
      } else {
        obj.Data = aData[index - 1];
      }
    });
    await this.EmuCoreSightPerformDAPAcc(AccDescList);
  },
  EmuCoreSightPerformDAPAcc: async function (paAccDesc) {
    const HEADER_SIZE = 4 + 4;
    const ACC_DESC_SIZE = 20;
    const RESP_SIZE = 8;
    var NumEntries;
    var SplitNumEntries;
    var DataDownSize;
    var aDataDown;
    var Pos;
    var i;

    this.LogOut("Coresight DAP accesss (" + paAccDesc.length + " times)");
    if (this.IsEmuHasCapEx(this.EMU_CAP_EX_CORESIGHT_DAP_ACC) == false) {
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
    if (DataDownSize > this._MAX_DAP_JOB_SIZE) {
      //
      // Split request recursively
      //
      SplitNumEntries = Math.floor(this._MAX_DAP_JOB_SIZE / ACC_DESC_SIZE);
      if ((HEADER_SIZE + (SplitNumEntries * ACC_DESC_SIZE)) > this._MAX_DAP_JOB_SIZE) {
        SplitNumEntries--;
      }
      await this.EmuCoreSightPerformDAPAcc(paAccDesc.slice(0, SplitNumEntries));
      await this.EmuCoreSightPerformDAPAcc(paAccDesc.slice(SplitNumEntries, (NumEntries + 1)));
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
    this.Store8LE(aDataDown, 0, this.EMU_CMD_CORESIGHT);
    this.Store8LE(aDataDown, 1, this._MAIN_Stat.ConIndex);
    this.Store8LE(aDataDown, 2, this.EMU_CMD_CORESIGHT_CMD_DAP_ACC);
    this.Store8LE(aDataDown, 3, 0);                                             // Dummy for alignment
    this.Store32LE(aDataDown, 4, NumEntries);
    Pos = 8;
    for (i = 0; i < NumEntries; i++) {
      //
      // If any of the following keys is not defined, set default.
      // The default is always read of the AP data register.
      //
      if (paAccDesc[i].Data == undefined) { paAccDesc[i].Data = 0; }
      if (paAccDesc[i].Mask == undefined) { paAccDesc[i].Mask = 0; }
      if (paAccDesc[i].CompVal == undefined) { paAccDesc[i].CompVal = 0; }
      if (paAccDesc[i].Status == undefined) { paAccDesc[i].Status = 0; }
      if (paAccDesc[i].TimeoutMsReadUntil == undefined) { paAccDesc[i].TimeoutMsReadUntil = 0; }
      if (paAccDesc[i].RegIndex == undefined) { paAccDesc[i].RegIndex = this.JLINK_CORESIGHT_AP_REG_DATA; }
      if (paAccDesc[i].APnDP == undefined) { paAccDesc[i].APnDP = this.JLINK_CORESIGHT_AP; }
      if (paAccDesc[i].RnW == undefined) { paAccDesc[i].RnW = this.JLINK_CORESIGHT_READ; }
      //
      // Fill transfer buffer
      //
      this.Store32LE(aDataDown, Pos, paAccDesc[i].Data); Pos += 4;
      this.Store32LE(aDataDown, Pos, paAccDesc[i].Mask); Pos += 4;
      this.Store32LE(aDataDown, Pos, paAccDesc[i].CompVal); Pos += 4;
      this.Store32LE(aDataDown, Pos, paAccDesc[i].TimeoutMsReadUntil); Pos += 4;
      this.Store8LE(aDataDown, Pos, paAccDesc[i].RegIndex); Pos += 1;
      this.Store8LE(aDataDown, Pos, paAccDesc[i].APnDP); Pos += 1;
      this.Store8LE(aDataDown, Pos, paAccDesc[i].RnW); Pos += 1;
      this.Store8LE(aDataDown, Pos, 0); Pos += 1; // Dummy for alignment
    }
    this._ActiveCmd.NumBytesReceived = 0;
    this._USBPort.Send(aDataDown, null, this.EventUSBOnSendError);                      // Queues write and waits until it is complete
    aBuf = await this.USBRead(NumEntries * RESP_SIZE);
    //
    // Store result
    //
    for (i = 0; i < NumEntries; i++) {
      paAccDesc[i].Status = this.Load32LE(aBuf, (i * 8));
      if (paAccDesc[i].RnW) {
        paAccDesc[i].Data = this.Load32LE(aBuf, (i * RESP_SIZE) + 4);
      }
      this.LogOut((paAccDesc[i].APnDP ? "AP" : "DP") + " " + (paAccDesc[i].RnW ? "read" : "write"));
      this.LogOut(" Register: " + paAccDesc[i].RegIndex);
      this.LogOut(" Status: " + paAccDesc[i].Status);
      this.LogOut(" Data:  " + this.ToHexString(paAccDesc[i].Data, true));
    }
  },
  /*****************************************************
  * StringToByteArray(): Converts a String into an U8 byte array
  */
  StringToByteArray: function (Text) {
    return new TextEncoder().encode(Text + "\0");
  },
  /*****************************************************
* ToHexString(): Converts a decimal number into an hexa string
*/
  ToHexString: function (num, hasPrefix) {
    return (hasPrefix ? "0x" : "") + num.toString(16).padStart(8, "0").toUpperCase();
  },
  USBRead: async function (NumBytes) {
    //
    // Read data from J-Link until <NumBytes> request is fulfilled.
    // We may get more bytes from J-Link as requested in call, so we need to buffer that for a subsequent _USB_Read() call
    // that then can feed the caller from the buffer instead of triggering another USB transaction.
    //
    // The idea is that the backend does large USB transfers to improve performance
    // but the application part can still request single bytes etc. that may be fed from an intermediate buffer.
    //
    while (this._ActiveCmd.NumBytesReceived < NumBytes) {
      await this._USBPort.Receive(this.EventUSBOnRecv, this.EventUSBOnRecvError); // Schedule read + wait until read is complete
    }
    //
    // Copy from global buffer into local one and return requested data to caller
    //
    Slice = _aDataBuf.slice(0, NumBytes);    // Extract received data into separate buffer we pass to caller
    _aDataBuf = _aDataBuf.slice(NumBytes);   // Move remaining data to start of array
    this._ActiveCmd.NumBytesReceived -= NumBytes; // Correct buffer fill state marker
    return Slice;
  },
  EventUSBOnRecvError: function (error) {
    this.EventOnError("USB receive error: " + error);
  },
  EventUSBOnRecv: function (data) {
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
    JlinkCom.LogOut("Received " + data.byteLength + " bytes");
    //
    // Add received data to the intermediate buffer.
    // If is the 1st receive for the given command, make sure that we allocate a buffer
    //
    if (JlinkCom._ActiveCmd.NumBytesReceived) {                      // Already data in the buffer? => Concatenate
      JlinkCom.LogOut("Concat " + data.byteLength + " bytes");
      aDataTmp = new Uint8Array(data.buffer);               // Convert stream to U8 array
      _aDataBuf = this.ConcatTypedArrays(_aDataBuf, aDataTmp);  // Extend existing buffer and add bytes to it
    } else {                                                // 1st receive? => Create buffer
      JlinkCom.LogOut("Copy " + data.byteLength + " bytes");
      _aDataBuf = new Uint8Array(data.buffer);              // Copy data into new tmp array
    }
    //
    // Increment buffer count.
    // _USB_Read() will schedule another read if necessary (not all bytes expected have been received yet).
    //
    JlinkCom._ActiveCmd.NumBytesReceived += data.byteLength;
  }
}
// Module = {
//   $JlinkCom: JlinkCom,
// };
// autoAddDeps(Module, '$JlinkCom');