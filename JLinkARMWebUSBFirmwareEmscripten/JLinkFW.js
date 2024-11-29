var SeggerBulk = {
  requestDevice: async function(){
    var USBObjPromise;
    const filters = [
      { 'vendorId': 0x1366, 'productId': 0x0101 }, // J-Link (default)                 | Flasher STM8 | Flasher ARM | Flasher 5 PRO
      { 'vendorId': 0x1366, 'productId': 0x0102 }, // J-Link USBAddr = 1 (obsolete)
      { 'vendorId': 0x1366, 'productId': 0x0103 }, // J-Link USBAddr = 2 (obsolete)
      { 'vendorId': 0x1366, 'productId': 0x0104 }, // J-Link USBAddr = 3 (obsolete)
      { 'vendorId': 0x1366, 'productId': 0x0105 }, // CDC + J-Link
      { 'vendorId': 0x1366, 'productId': 0x0106 }, // CDC
      { 'vendorId': 0x1366, 'productId': 0x0107 }, // RNDIS  + J-Link
      { 'vendorId': 0x1366, 'productId': 0x0108 }, // J-Link + MSD
      // [new format]
      { 'vendorId': 0x1366, 'productId': 0x1001 }, // MSD
      { 'vendorId': 0x1366, 'productId': 0x1002 }, // RNDIS
      { 'vendorId': 0x1366, 'productId': 0x1003 }, // RNDIS  + MSD
      { 'vendorId': 0x1366, 'productId': 0x1004 }, // 1x CDC
      { 'vendorId': 0x1366, 'productId': 0x1005 }, // 1x CDC    + MSD
      { 'vendorId': 0x1366, 'productId': 0x1006 }, // RNDIS  + 1x CDC
      { 'vendorId': 0x1366, 'productId': 0x1007 }, // RNDIS  + 1x CDC    + MSD
      { 'vendorId': 0x1366, 'productId': 0x1008 }, // HID
      { 'vendorId': 0x1366, 'productId': 0x1009 }, // MSD    + HID
      { 'vendorId': 0x1366, 'productId': 0x100a }, // RNDIS  + HID
      { 'vendorId': 0x1366, 'productId': 0x100b }, // RNDIS  + MSD    + HID
      { 'vendorId': 0x1366, 'productId': 0x100c }, //          1x CDC    + HID
      { 'vendorId': 0x1366, 'productId': 0x100d }, //          1x CDC    + MSD    + HID
      { 'vendorId': 0x1366, 'productId': 0x100e }, // RNDIS  + 1x CDC    + HID
      { 'vendorId': 0x1366, 'productId': 0x100f }, // RNDIS  + 1x CDC    + MSD + HID
      { 'vendorId': 0x1366, 'productId': 0x1010 }, // J_LINK_SEGGER_DRV
      { 'vendorId': 0x1366, 'productId': 0x1011 }, // J_LINK_SEGGER_DRV                                + MSD
      { 'vendorId': 0x1366, 'productId': 0x1012 }, // J_LINK_SEGGER_DRV                     + RNDIS
      { 'vendorId': 0x1366, 'productId': 0x1013 }, // J_LINK_SEGGER_DRV                     + RNDIS    + MSD
      { 'vendorId': 0x1366, 'productId': 0x1014 }, // J_LINK_SEGGER_DRV          + 1x CDC
      { 'vendorId': 0x1366, 'productId': 0x1015 }, // J_LINK_SEGGER_DRV          + 1x CDC              + MSD
      { 'vendorId': 0x1366, 'productId': 0x1016 }, // J_LINK_SEGGER_DRV          + 1x CDC   + RNDIS
      { 'vendorId': 0x1366, 'productId': 0x1017 }, // J_LINK_SEGGER_DRV          + 1x CDC   + RNDIS    + MSD
      { 'vendorId': 0x1366, 'productId': 0x1018 }, // J_LINK_SEGGER_DRV + HID
      { 'vendorId': 0x1366, 'productId': 0x1019 }, // J_LINK_SEGGER_DRV + HID                          + MSD
      { 'vendorId': 0x1366, 'productId': 0x101a }, // J_LINK_SEGGER_DRV + HID               + RNDIS
      { 'vendorId': 0x1366, 'productId': 0x101b }, // J_LINK_SEGGER_DRV + HID               + RNDIS    + MSD
      { 'vendorId': 0x1366, 'productId': 0x101c }, // J_LINK_SEGGER_DRV + HID    + 1x CDC
      { 'vendorId': 0x1366, 'productId': 0x101d }, // J_LINK_SEGGER_DRV + HID    + 1x CDC              + MSD
      { 'vendorId': 0x1366, 'productId': 0x101e }, // J_LINK_SEGGER_DRV + HID    + 1x CDC   + RNDIS
      { 'vendorId': 0x1366, 'productId': 0x101f }, // J_LINK_SEGGER_DRV + HID    + 1x CDC   + RNDIS    + MSD
      { 'vendorId': 0x1366, 'productId': 0x1020 }, // J_LINK_WINUSB_DRV
      { 'vendorId': 0x1366, 'productId': 0x1021 }, // J_LINK_WINUSB_DRV                                + MSD
      { 'vendorId': 0x1366, 'productId': 0x1022 }, // J_LINK_WINUSB_DRV                     + RNDIS
      { 'vendorId': 0x1366, 'productId': 0x1023 }, // J_LINK_WINUSB_DRV                     + RNDIS    + MSD
      { 'vendorId': 0x1366, 'productId': 0x1024 }, // J_LINK_WINUSB_DRV          + 1x CDC
      { 'vendorId': 0x1366, 'productId': 0x1025 }, // J_LINK_WINUSB_DRV          + 1x CDC              + MSD
      { 'vendorId': 0x1366, 'productId': 0x1026 }, // J_LINK_WINUSB_DRV          + 1x CDC   + RNDIS
      { 'vendorId': 0x1366, 'productId': 0x1027 }, // J_LINK_WINUSB_DRV          + 1x CDC   + RNDIS    + MSD
      { 'vendorId': 0x1366, 'productId': 0x1028 }, // J_LINK_WINUSB_DRV + HID
      { 'vendorId': 0x1366, 'productId': 0x1029 }, // J_LINK_WINUSB_DRV + HID                          + MSD
      { 'vendorId': 0x1366, 'productId': 0x102a }, // J_LINK_WINUSB_DRV + HID               + RNDIS
      { 'vendorId': 0x1366, 'productId': 0x102b }, // J_LINK_WINUSB_DRV + HID               + RNDIS    + MSD
      { 'vendorId': 0x1366, 'productId': 0x102c }, // J_LINK_WINUSB_DRV + HID    + 1x CDC
      { 'vendorId': 0x1366, 'productId': 0x102d }, // J_LINK_WINUSB_DRV + HID    + 1x CDC              + MSD
      { 'vendorId': 0x1366, 'productId': 0x102e }, // J_LINK_WINUSB_DRV + HID    + 1x CDC   + RNDIS
      { 'vendorId': 0x1366, 'productId': 0x102f }, // J_LINK_WINUSB_DRV + HID    + 1x CDC   + RNDIS    + MSD
      { 'vendorId': 0x1366, 'productId': 0x1050 }, // J_LINK_SEGGER_DRV          + 2x CDC
      { 'vendorId': 0x1366, 'productId': 0x1051 }, // J_LINK_SEGGER_DRV          + 2x CDC              + MSD
      { 'vendorId': 0x1366, 'productId': 0x1052 }, // J_LINK_SEGGER_DRV          + 2x CDC   + RNDIS
      { 'vendorId': 0x1366, 'productId': 0x1053 }, // J_LINK_SEGGER_DRV          + 2x CDC   + RNDIS    + MSD
      { 'vendorId': 0x1366, 'productId': 0x1054 }, // J_LINK_SEGGER_DRV          + 3x CDC
      { 'vendorId': 0x1366, 'productId': 0x1055 }, // J_LINK_SEGGER_DRV          + 3x CDC              + MSD
      { 'vendorId': 0x1366, 'productId': 0x1056 }, // J_LINK_SEGGER_DRV          + 3x CDC   + RNDIS
      { 'vendorId': 0x1366, 'productId': 0x1057 }, // J_LINK_SEGGER_DRV          + 3x CDC   + RNDIS    + MSD
      { 'vendorId': 0x1366, 'productId': 0x1058 }, // J_LINK_SEGGER_DRV + HID    + 2x CDC
      { 'vendorId': 0x1366, 'productId': 0x1059 }, // J_LINK_SEGGER_DRV + HID    + 2x CDC              + MSD
      { 'vendorId': 0x1366, 'productId': 0x105a }, // J_LINK_SEGGER_DRV + HID    + 2x CDC   + RNDIS
      { 'vendorId': 0x1366, 'productId': 0x105b }, // J_LINK_SEGGER_DRV + HID    + 2x CDC   + RNDIS    + MSD
      { 'vendorId': 0x1366, 'productId': 0x105c }, // J_LINK_SEGGER_DRV + HID    + 3x CDC
      { 'vendorId': 0x1366, 'productId': 0x105d }, // J_LINK_SEGGER_DRV + HID    + 3x CDC              + MSD
      { 'vendorId': 0x1366, 'productId': 0x105e }, // J_LINK_SEGGER_DRV + HID    + 3x CDC   + RNDIS
      { 'vendorId': 0x1366, 'productId': 0x105f }, // J_LINK_SEGGER_DRV + HID    + 3x CDC   + RNDIS    + MSD
      { 'vendorId': 0x1366, 'productId': 0x1060 }, // J_LINK_WINUSB_DRV          + 2x CDC
      { 'vendorId': 0x1366, 'productId': 0x1061 }, // J_LINK_WINUSB_DRV          + 2x CDC              + MSD
      { 'vendorId': 0x1366, 'productId': 0x1062 }, // J_LINK_WINUSB_DRV          + 2x CDC   + RNDIS
      { 'vendorId': 0x1366, 'productId': 0x1063 }, // J_LINK_WINUSB_DRV          + 2x CDC   + RNDIS    + MSD
      { 'vendorId': 0x1366, 'productId': 0x1064 }, // J_LINK_WINUSB_DRV          + 3x CDC
      { 'vendorId': 0x1366, 'productId': 0x1065 }, // J_LINK_WINUSB_DRV          + 3x CDC              + MSD
      { 'vendorId': 0x1366, 'productId': 0x1066 }, // J_LINK_WINUSB_DRV          + 3x CDC   + RNDIS
      { 'vendorId': 0x1366, 'productId': 0x1067 }, // J_LINK_WINUSB_DRV          + 3x CDC   + RNDIS    + MSD
      { 'vendorId': 0x1366, 'productId': 0x1068 }, // J_LINK_WINUSB_DRV + HID    + 2x CDC
      { 'vendorId': 0x1366, 'productId': 0x1069 }, // J_LINK_WINUSB_DRV + HID    + 2x CDC              + MSD
      { 'vendorId': 0x1366, 'productId': 0x106a }, // J_LINK_WINUSB_DRV + HID    + 2x CDC   + RNDIS
      { 'vendorId': 0x1366, 'productId': 0x106b }, // J_LINK_WINUSB_DRV + HID    + 2x CDC   + RNDIS    + MSD
      { 'vendorId': 0x1366, 'productId': 0x106c }, // J_LINK_WINUSB_DRV + HID    + 3x CDC
      { 'vendorId': 0x1366, 'productId': 0x106d }, // J_LINK_WINUSB_DRV + HID    + 3x CDC              + MSD
      { 'vendorId': 0x1366, 'productId': 0x106e }, // J_LINK_WINUSB_DRV + HID    + 3x CDC   + RNDIS
      { 'vendorId': 0x1366, 'productId': 0x106f }
    ];
    USBObjPromise = await navigator.usb
      .requestDevice({ filters });

    return USBObjPromise;
  },
  _LogOut(sLog) {
    if (SeggerBulk.Common._DEBUG) {
      console.log(sLog);
    }
  },
  SetMaxTransferSize(MaxTransferSize) {
    this.Common._MaxTransferSize = MaxTransferSize;
  },
  _DetermineDeviceParas: async function(result) {
    var configurationInterfaces;
    var iIF;
    var iAltIF;
    var element;
    var elementalt;
    var Found;
    var sErr;
    var v;
    //
    // For J-Link:
    // The EPs we need to use for communication depends on the J-Link configuration
    // As the BULK component is always the last one in the USB descriptors, the BULK EPs move depending on which USB components the J-Link populates
    // However, we can easily find them by looking for the interface that has class == 0xFF (vendor specific).
    // This is the interface that holds the BULK EPs we use for WebUSB
    //
    // For emPower:
    // Mainly the same as for J-Link
    //
    this._LogOut("_cbDetermineDeviceParas()");
    configurationInterfaces = this.Common._Device.configuration.interfaces;    // Set in constructor of this class
    Found = 0;
    for (iIF = 0; iIF < configurationInterfaces.length; iIF++) {        // Iterate through interfaces of device
      element = configurationInterfaces[iIF];
      for (iAltIF = 0; iAltIF < element.alternates.length; iAltIF++) {  // Iterate through alternate interfaces of current interface
        elementalt = element.alternates[iAltIF];
        this._LogOut("_cbDetermineDeviceParas(): iIF: " + iIF + " iAltIF: " + iAltIF + " class: " + elementalt.interfaceClass);
        if (elementalt.interfaceClass==0xff) {                          // Vendor specific alternate interface found? => Done
          Found = 1;
          break;
        }
      }
      if (Found) {
        break;
      }
    }
    if (Found) {
      if (elementalt.endpoints.length != 2) {                          // We expect exact 2 EPs for the vendor specific interface
        Found = 0;
        sErr = "USB interface does not provide needed in/out EPs";
      }
    } else {
      sErr = "Not matching USB interface found";
    }
    if (Found) {
      this.Common._InterfaceNumber = element.interfaceNumber;
      if (elementalt.endpoints[0] == "out") {
        this.Common._EPOut = elementalt.endpoints[0].endpointNumber;
        this.Common._EPIn  = elementalt.endpoints[1].endpointNumber;
      } else {
        this.Common._EPIn  = elementalt.endpoints[0].endpointNumber;
        this.Common._EPOut = elementalt.endpoints[1].endpointNumber;
      }
      this.Common._MaxPacketSize = elementalt.endpoints[0].packetSize;
      v = Promise.resolve(0);
    } else {
      v = Promise.reject(sErr);
    }
    return v;
  },
   _OpenDevice: async function(result) {
    this._LogOut("_cbOpenDevice()");
    this.Common._Device = result;
    return  await this.Common._Device.open();                              // Schedules asynchronous operation. Done as soon as we leave javascript function
  },
  Receive(cbOnOK, cbOnErr) {
    var ObjPromise;
    var NumBytesAtOnce;
    //
    // By default, request up to 2048 bytes from the device in 1 chunk.
    // This is to mimic the old SEGGER USB kernel driver behavior.
    // There is no NULL packet expected after a transfer of 2048 bytes.
    // The application may change this value and configure J-Link differently, if it supports EMU_CMD_SET_EMU_OPTION with the option SET_MAX_TRANSFER_SIZE.
    // The receive function will return if either all data (MaxTransferSize) has been received or a short packet (< MaxPacketSize> has been received.
    //
    NumBytesAtOnce = this.Common._MaxTransferSize;                            // Request up to <MaxTransferSize> at once. Needs to be a multiple of <MaxPacketSize>
    this._LogOut("receive(NumBytesAtOnce = " + NumBytesAtOnce + ")");
    ObjPromise = this.Common._Device.transferIn(this.Common._EPIn, NumBytesAtOnce);
    ObjPromise.then(cbOnOK, cbOnErr);
    return ObjPromise;
  },
  Send(data, cbOnOK, cbOnErr) {
    var ObjPromise;
    this._LogOut("send()");
    ObjPromise = this.Common._Device.transferOut(this.Common._EPOut, data);
    ObjPromise.then(cbOnOK, cbOnErr);
    return ObjPromise;
  },
  _SetConfig: async function(result) {
    this._LogOut("_cbSetConfig()");
    if (this.Common._Device.configuration === null) {        // If OS has not already select a configuration for the device, trigger setting one
      return this.Common._Device.selectConfiguration(1);            // Trigger set device configuration
    }
    return result;
  },
  _ClaimIF: async function(result) {
    this._LogOut("_cbClaimIF(): claim IF " + this.Common._InterfaceNumber);
    return this.Common._Device.claimInterface(this.Common._InterfaceNumber);               // Schedules asynchronous operation. Done as soon as we leave javascript function
  },
  Connect: async function() {
    var v;
    var USBObjPromise;
    var cb;
    //
    // Register an open sequence
    // Every asynchronous operation will be executed sequentially.
    // If an operation fails the error will be catched and handled.
    //
    this._LogOut("connect()");
    try {
      USBObjPromise =  await SeggerBulk.requestDevice();  // Schedules asynchronous operation. Done as soon as we leave javascript function
       await this._OpenDevice(USBObjPromise);
       await this._SetConfig();
       await this._DetermineDeviceParas();
       await this._ClaimIF();
       await this._SetAltIF();
      this._LogOut("connect() finished");
    } catch(e) {
      this._LogOut(e);
      if (e instanceof TypeError) {
        //
        // Check for browser support
        //
        alert("This browser does not support WebUSB.\rPlease use a supporting Browser.\rCheck compatibility: https://caniuse.com/webusb");
        return Promise.reject("Error: Browser does not support WebUSB. Check compatibility: https://caniuse.com/webusb");
      } else if (e instanceof DOMException) {
        //
        // Handle DOMExceptions
        //
        switch (e.name) {
          case "NotFoundError":
              return Promise.reject("Disconnected"); // User closed device selection popup
          default:
        }
      }
      return Promise.reject(e);
    }
    return Promise.resolve();
  },
  Disconnect: async function() {
    this._LogOut("disconnect()");
    return this.Common._Device.close();
  },
  //  _SetAltIF: async function(result) {
  //   this._LogOut("_cbSetAltIF() select IF " + this.Common._InterfaceNumber);
  //   return this.Common._Device.selectAlternateInterface(this.Common._InterfaceNumber, 0);  // Schedules asynchronous operation. Done as soon as we leave javascript function
  // },
  _SetAltIF: async function() {
    this._LogOut("_cbSetAltIF() select IF " + this.Common._InterfaceNumber);
    return this.Common._Device.selectAlternateInterface(this.Common._InterfaceNumber, 0);  // Schedules asynchronous operation. Done as soon as we leave javascript function
  },

  Common: {
 //
      // Add member variables to class
      // Most Will be initialized during connect phase at runtime
      //
      _InterfaceNumber : 0,  // Initialized during connect phase
      _EPIn            : 0,  // Initialized during connect phase
      _EPOut           : 0,  // Initialized during connect phase
      _Device          : 0,  // Initialized during connect phase
      _MaxPacketSize   : 0,  // Initialized during connect phase
      _MaxTransferSize : 2048,  // Compatibility to SEGGER kernel mode driver behavior and older J-Links (See Receive()). May be modified later on by application via SetMaxTransferSize()
      _DEBUG           : 1,  // May be set to enable debug log output for class instance
      aFilters         : [
        // [old format]
        { 'vendorId': 0x1366, 'productId': 0x0101 }, // J-Link (default)                 | Flasher STM8 | Flasher ARM | Flasher 5 PRO
        { 'vendorId': 0x1366, 'productId': 0x0102 }, // J-Link USBAddr = 1 (obsolete)
        { 'vendorId': 0x1366, 'productId': 0x0103 }, // J-Link USBAddr = 2 (obsolete)
        { 'vendorId': 0x1366, 'productId': 0x0104 }, // J-Link USBAddr = 3 (obsolete)
        { 'vendorId': 0x1366, 'productId': 0x0105 }, // CDC + J-Link
        { 'vendorId': 0x1366, 'productId': 0x0106 }, // CDC
        { 'vendorId': 0x1366, 'productId': 0x0107 }, // RNDIS  + J-Link
        { 'vendorId': 0x1366, 'productId': 0x0108 }, // J-Link + MSD
        // [new format]
        { 'vendorId': 0x1366, 'productId': 0x1001 }, // MSD
        { 'vendorId': 0x1366, 'productId': 0x1002 }, // RNDIS
        { 'vendorId': 0x1366, 'productId': 0x1003 }, // RNDIS  + MSD
        { 'vendorId': 0x1366, 'productId': 0x1004 }, // 1x CDC
        { 'vendorId': 0x1366, 'productId': 0x1005 }, // 1x CDC    + MSD
        { 'vendorId': 0x1366, 'productId': 0x1006 }, // RNDIS  + 1x CDC
        { 'vendorId': 0x1366, 'productId': 0x1007 }, // RNDIS  + 1x CDC    + MSD
        { 'vendorId': 0x1366, 'productId': 0x1008 }, // HID
        { 'vendorId': 0x1366, 'productId': 0x1009 }, // MSD    + HID
        { 'vendorId': 0x1366, 'productId': 0x100a }, // RNDIS  + HID
        { 'vendorId': 0x1366, 'productId': 0x100b }, // RNDIS  + MSD    + HID
        { 'vendorId': 0x1366, 'productId': 0x100c }, //          1x CDC    + HID
        { 'vendorId': 0x1366, 'productId': 0x100d }, //          1x CDC    + MSD    + HID
        { 'vendorId': 0x1366, 'productId': 0x100e }, // RNDIS  + 1x CDC    + HID
        { 'vendorId': 0x1366, 'productId': 0x100f }, // RNDIS  + 1x CDC    + MSD + HID
        { 'vendorId': 0x1366, 'productId': 0x1010 }, // J_LINK_SEGGER_DRV
        { 'vendorId': 0x1366, 'productId': 0x1011 }, // J_LINK_SEGGER_DRV                                + MSD
        { 'vendorId': 0x1366, 'productId': 0x1012 }, // J_LINK_SEGGER_DRV                     + RNDIS
        { 'vendorId': 0x1366, 'productId': 0x1013 }, // J_LINK_SEGGER_DRV                     + RNDIS    + MSD
        { 'vendorId': 0x1366, 'productId': 0x1014 }, // J_LINK_SEGGER_DRV          + 1x CDC
        { 'vendorId': 0x1366, 'productId': 0x1015 }, // J_LINK_SEGGER_DRV          + 1x CDC              + MSD
        { 'vendorId': 0x1366, 'productId': 0x1016 }, // J_LINK_SEGGER_DRV          + 1x CDC   + RNDIS
        { 'vendorId': 0x1366, 'productId': 0x1017 }, // J_LINK_SEGGER_DRV          + 1x CDC   + RNDIS    + MSD
        { 'vendorId': 0x1366, 'productId': 0x1018 }, // J_LINK_SEGGER_DRV + HID
        { 'vendorId': 0x1366, 'productId': 0x1019 }, // J_LINK_SEGGER_DRV + HID                          + MSD
        { 'vendorId': 0x1366, 'productId': 0x101a }, // J_LINK_SEGGER_DRV + HID               + RNDIS
        { 'vendorId': 0x1366, 'productId': 0x101b }, // J_LINK_SEGGER_DRV + HID               + RNDIS    + MSD
        { 'vendorId': 0x1366, 'productId': 0x101c }, // J_LINK_SEGGER_DRV + HID    + 1x CDC
        { 'vendorId': 0x1366, 'productId': 0x101d }, // J_LINK_SEGGER_DRV + HID    + 1x CDC              + MSD
        { 'vendorId': 0x1366, 'productId': 0x101e }, // J_LINK_SEGGER_DRV + HID    + 1x CDC   + RNDIS
        { 'vendorId': 0x1366, 'productId': 0x101f }, // J_LINK_SEGGER_DRV + HID    + 1x CDC   + RNDIS    + MSD
        { 'vendorId': 0x1366, 'productId': 0x1020 }, // J_LINK_WINUSB_DRV
        { 'vendorId': 0x1366, 'productId': 0x1021 }, // J_LINK_WINUSB_DRV                                + MSD
        { 'vendorId': 0x1366, 'productId': 0x1022 }, // J_LINK_WINUSB_DRV                     + RNDIS
        { 'vendorId': 0x1366, 'productId': 0x1023 }, // J_LINK_WINUSB_DRV                     + RNDIS    + MSD
        { 'vendorId': 0x1366, 'productId': 0x1024 }, // J_LINK_WINUSB_DRV          + 1x CDC
        { 'vendorId': 0x1366, 'productId': 0x1025 }, // J_LINK_WINUSB_DRV          + 1x CDC              + MSD
        { 'vendorId': 0x1366, 'productId': 0x1026 }, // J_LINK_WINUSB_DRV          + 1x CDC   + RNDIS
        { 'vendorId': 0x1366, 'productId': 0x1027 }, // J_LINK_WINUSB_DRV          + 1x CDC   + RNDIS    + MSD
        { 'vendorId': 0x1366, 'productId': 0x1028 }, // J_LINK_WINUSB_DRV + HID
        { 'vendorId': 0x1366, 'productId': 0x1029 }, // J_LINK_WINUSB_DRV + HID                          + MSD
        { 'vendorId': 0x1366, 'productId': 0x102a }, // J_LINK_WINUSB_DRV + HID               + RNDIS
        { 'vendorId': 0x1366, 'productId': 0x102b }, // J_LINK_WINUSB_DRV + HID               + RNDIS    + MSD
        { 'vendorId': 0x1366, 'productId': 0x102c }, // J_LINK_WINUSB_DRV + HID    + 1x CDC
        { 'vendorId': 0x1366, 'productId': 0x102d }, // J_LINK_WINUSB_DRV + HID    + 1x CDC              + MSD
        { 'vendorId': 0x1366, 'productId': 0x102e }, // J_LINK_WINUSB_DRV + HID    + 1x CDC   + RNDIS
        { 'vendorId': 0x1366, 'productId': 0x102f }, // J_LINK_WINUSB_DRV + HID    + 1x CDC   + RNDIS    + MSD
        { 'vendorId': 0x1366, 'productId': 0x1050 }, // J_LINK_SEGGER_DRV          + 2x CDC
        { 'vendorId': 0x1366, 'productId': 0x1051 }, // J_LINK_SEGGER_DRV          + 2x CDC              + MSD
        { 'vendorId': 0x1366, 'productId': 0x1052 }, // J_LINK_SEGGER_DRV          + 2x CDC   + RNDIS
        { 'vendorId': 0x1366, 'productId': 0x1053 }, // J_LINK_SEGGER_DRV          + 2x CDC   + RNDIS    + MSD
        { 'vendorId': 0x1366, 'productId': 0x1054 }, // J_LINK_SEGGER_DRV          + 3x CDC
        { 'vendorId': 0x1366, 'productId': 0x1055 }, // J_LINK_SEGGER_DRV          + 3x CDC              + MSD
        { 'vendorId': 0x1366, 'productId': 0x1056 }, // J_LINK_SEGGER_DRV          + 3x CDC   + RNDIS
        { 'vendorId': 0x1366, 'productId': 0x1057 }, // J_LINK_SEGGER_DRV          + 3x CDC   + RNDIS    + MSD
        { 'vendorId': 0x1366, 'productId': 0x1058 }, // J_LINK_SEGGER_DRV + HID    + 2x CDC
        { 'vendorId': 0x1366, 'productId': 0x1059 }, // J_LINK_SEGGER_DRV + HID    + 2x CDC              + MSD
        { 'vendorId': 0x1366, 'productId': 0x105a }, // J_LINK_SEGGER_DRV + HID    + 2x CDC   + RNDIS
        { 'vendorId': 0x1366, 'productId': 0x105b }, // J_LINK_SEGGER_DRV + HID    + 2x CDC   + RNDIS    + MSD
        { 'vendorId': 0x1366, 'productId': 0x105c }, // J_LINK_SEGGER_DRV + HID    + 3x CDC
        { 'vendorId': 0x1366, 'productId': 0x105d }, // J_LINK_SEGGER_DRV + HID    + 3x CDC              + MSD
        { 'vendorId': 0x1366, 'productId': 0x105e }, // J_LINK_SEGGER_DRV + HID    + 3x CDC   + RNDIS
        { 'vendorId': 0x1366, 'productId': 0x105f }, // J_LINK_SEGGER_DRV + HID    + 3x CDC   + RNDIS    + MSD
        { 'vendorId': 0x1366, 'productId': 0x1060 }, // J_LINK_WINUSB_DRV          + 2x CDC
        { 'vendorId': 0x1366, 'productId': 0x1061 }, // J_LINK_WINUSB_DRV          + 2x CDC              + MSD
        { 'vendorId': 0x1366, 'productId': 0x1062 }, // J_LINK_WINUSB_DRV          + 2x CDC   + RNDIS
        { 'vendorId': 0x1366, 'productId': 0x1063 }, // J_LINK_WINUSB_DRV          + 2x CDC   + RNDIS    + MSD
        { 'vendorId': 0x1366, 'productId': 0x1064 }, // J_LINK_WINUSB_DRV          + 3x CDC
        { 'vendorId': 0x1366, 'productId': 0x1065 }, // J_LINK_WINUSB_DRV          + 3x CDC              + MSD
        { 'vendorId': 0x1366, 'productId': 0x1066 }, // J_LINK_WINUSB_DRV          + 3x CDC   + RNDIS
        { 'vendorId': 0x1366, 'productId': 0x1067 }, // J_LINK_WINUSB_DRV          + 3x CDC   + RNDIS    + MSD
        { 'vendorId': 0x1366, 'productId': 0x1068 }, // J_LINK_WINUSB_DRV + HID    + 2x CDC
        { 'vendorId': 0x1366, 'productId': 0x1069 }, // J_LINK_WINUSB_DRV + HID    + 2x CDC              + MSD
        { 'vendorId': 0x1366, 'productId': 0x106a }, // J_LINK_WINUSB_DRV + HID    + 2x CDC   + RNDIS
        { 'vendorId': 0x1366, 'productId': 0x106b }, // J_LINK_WINUSB_DRV + HID    + 2x CDC   + RNDIS    + MSD
        { 'vendorId': 0x1366, 'productId': 0x106c }, // J_LINK_WINUSB_DRV + HID    + 3x CDC
        { 'vendorId': 0x1366, 'productId': 0x106d }, // J_LINK_WINUSB_DRV + HID    + 3x CDC              + MSD
        { 'vendorId': 0x1366, 'productId': 0x106e }, // J_LINK_WINUSB_DRV + HID    + 3x CDC   + RNDIS
        { 'vendorId': 0x1366, 'productId': 0x106f }, // J_LINK_WINUSB_DRV + HID    + 3x CDC   + RNDIS    + MSD
      ],

  }
}

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
   _DEBUG_DISABLE : 0,
  // Simple Debug mode (Simple log - displayed only message on the console)
   _DEBUG_SIMP : 1,
  // Full Debug mode (Message and target caller displayed on the browser console)
   _DEBUG_FULL : 2,

   _DEBUG : 2,

  /*****************************************************
  * _MAIN_Stat: Communication status
  */
   _MAIN_Stat: null,
  /*****************************************************
  * _IsConnected: Connection status
  */
   _IsConnected : 0,
  /*****************************************************
  * _USBPort: USB Port of J-Link
  */
   _USBPort: null,
  /*****************************************************
  * _ActiveCmd: Active Command on USB port
  */
   _ActiveCmd : { NumBytesReceived: 0 },
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
   EMU_CMD_SET_EMU_OPTION                      : 0x0E,
   EMU_CMD_CORESIGHT                           : 0x1A,
   EMU_CMD_GET_VERSION                         : 0x01,
   EMU_CMD_GET_CAPS                            : 0xE8,
   EMU_CMD_GET_CAPS_EX                         : 0xED,
   EMU_CMD_REGISTER                            : 0x09,
   EMU_CMD_GET_PROBE_INFO_CMD_GET_CAPS         : 0,
   EMU_CMD_CORESIGHT_CMD_CONFIG                : 0,
   EMU_CMD_CORESIGHT_CMD_DAP_ACC               : 1,
   EMU_CMD_GET_PROBE_INFO                      : 28,
   EMU_CMD_HW_SELECT_IF                        : 0xC7,
   EMU_CMD_SET_SPEED                           : 0x05,
   EMU_PROBE_INFO_SUB_CMD_WRITE_MSD_IMG_CHUNK  : 5,
   EMU_PROBE_INFO_SUB_CMD_WRITE_MSD_IMG_END    : 6,
  //
  // JLINK target interface settings
  //
   JLINK_TIF_JTAG                              : 0x00,
   JLINK_TIF_SWD                               : 0x01,
  //
  // J-Link USB capabilities
  //
   EMU_CAP_RESERVED                            : (1 << 0),
   EMU_CAP_GET_HW_VERSION                      : (1 << 1),
   EMU_CAP_WRITE_DCC                           : (1 << 2),
   EMU_CAP_ADAPTIVE_CLOCKING                   : (1 << 3),
   EMU_CAP_READ_CONFIG                         : (1 << 4),
   EMU_CAP_WRITE_CONFIG                        : (1 << 5),
   EMU_CAP_TRACE                               : (1 << 6),
   EMU_CAP_WRITE_MEM                           : (1 << 7),
   EMU_CAP_READ_MEM                            : (1 << 8),
   EMU_CAP_SPEED_INFO                          : (1 << 9),
   EMU_CAP_EXEC_CODE                           : (1 << 10),
   EMU_CAP_GET_MAX_BLOCK_SIZE                  : (1 << 11),
   EMU_CAP_GET_HW_INFO                         : (1 << 12),
   EMU_CAP_SET_KS_POWER                        : (1 << 13),
   EMU_CAP_RESET_STOP_TIMED                    : (1 << 14),
   EMU_CAP_SHORTEN_LIFE                        : (1 << 15),
   EMU_CAP_MEASURE_RTCK_REACT                  : (1 << 16),
   EMU_CAP_SELECT_IF                           : (1 << 17),
   EMU_CAP_RW_MEM_ARM79                        : (1 << 18),
   EMU_CAP_GET_COUNTERS                        : (1 << 19),
   EMU_CAP_READ_DCC                            : (1 << 20),
   EMU_CAP_GET_CPU_CAPS                        : (1 << 21),
   EMU_CAP_EXEC_CPU_CMD                        : (1 << 22),
   EMU_CAP_SWO                                 : (1 << 23),
   EMU_CAP_WRITE_DCC_EX                        : (1 << 24),
   EMU_CAP_UPDATE_FIRMWARE_EX                  : (1 << 25),
   EMU_CAP_FILE_IO                             : (1 << 26),
   EMU_CAP_REGISTER                            : (1 << 27),
   EMU_CAP_INDICATORS                          : (1 << 28),
   EMU_CAP_TEST_NET_SPEED                      : (1 << 29),
   EMU_CAP_RAWTRACE                            : (1 << 30),
   EMU_CAP_GET_CAPS_EX                         : (1 << 31),
  //
  // J-Link USB extended capabilities
  //
   EMU_CAP_EX_SET_EMU_OPTION                   : 46,           // Supports command "EMU_CMD_SET_EMU_OPTION"
   EMU_CAP_EX_CORESIGHT_DAP_ACC                : 62,
   EMU_CAP_EX_GET_PROBE_INFO                   : 64,           // Supports EMU_CMD_GET_PROBE_INFO
  //
  // Caps for EMU_CMD_GET_PROBE_INFO
  //
   EMU_PROBE_INFO_CAP_MSD_IMG                  : 2,
  //
  // Register sub commands
  //
   REG_CMD_REGISTER                            : 100,
   REG_CMD_UNREGISTER                          : 101,
  //
  // CoreSight Register
  //
   JLINK_CORESIGHT_WRITE                       : 0,
   JLINK_CORESIGHT_READ                        : 1,
   JLINK_CORESIGHT_DP                          : 0,
   JLINK_CORESIGHT_AP                          : 1,
   JLINK_CORESIGHT_DP_REG_IDCODE               : 0,
   JLINK_CORESIGHT_DP_REG_ABORT                : 0,
   JLINK_CORESIGHT_DP_REG_CTRL_STAT            : 1,
   JLINK_CORESIGHT_DP_REG_SELECT               : 2,
   JLINK_CORESIGHT_DP_REG_RDBUF                : 3,
   JLINK_CORESIGHT_AP_REG_CTRL                 : 0,          // CSW register
   JLINK_CORESIGHT_AP_REG_ADDR                 : 1,
   JLINK_CORESIGHT_AP_REG_DATA                 : 3,
  //
  // Host settings
  //
   _MAIN_PIDx                                  : 0xAB,
   _MAIN_HostId                                : 0xCD,
   _MAX_DAP_JOB_SIZE                           : 0x400,

  UsbConnect: async function() {

    // Reset MAIN Stats
    this._MAIN_Stat = {
      NumConnections:  0,
      ConIndex:       -1,
      aConInfo:       [],
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
    if (this._DEBUG == this._DEBUG_SIMP || this._DEBUG == this._DEBUG_FULL) {
      var PreStr = "";
      if (this._DEBUG == this._DEBUG_FULL) {
        // PreStr = new Date().getTime().toString() + " - " + JlinkCom.LogOut.caller.name + ": ";
        PreStr = new Date().getTime().toString() +" - " + ": ";;
      }
      PreStr = PreStr + sLog;
      console.log(PreStr);
    }
  },
    /*****************************************************
  * ByteArrayToASCIIString(): Converts U8 byte array into a String
  */
  ByteArrayToASCIIString:function(aByteArray) {
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
  EventUSBOnSendError: function(Value) {
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
  ConcatTypedArrays:function(a, b) { // a, b TypedArray of same type
    var c;
    c = new (a.constructor)(a.length + b.length);
    c.set(a, 0);
    c.set(b, a.length);
    return c;
  },
  /*****************************************************
  * Store8LE(): Converts an U8 parameter to a byte array
  */
  Store8LE:function(aByte, Pos, Val) {
    new DataView(aByte.buffer).setUint8(Pos, Val);
  },
  
  /*****************************************************
  * Store16LE(): Converts an U16 parameter to a byte array
  */
  Store16LE:function(aByte, Pos, Val) {
    new DataView(aByte.buffer).setUint16(Pos, Val, true);
  },

  /*****************************************************
  * Store32LE(): Converts an U32 parameter to a byte array
  */
  Store32LE:function(aByte, Pos, Val) {
    new DataView(aByte.buffer).setUint32(Pos, Val, true);
  },

  /*****************************************************
  * Load8LE(): Reads an U8 parameter from a byte array
  */
  Load8LE:function(aByte, Pos) {
    return new DataView(aByte.buffer).getUint8(Pos, true);
  },
  
  /*****************************************************
  * Load16LE(): Reads an U16 parameter from a byte array
  */
  Load16LE:function(aByte, Pos) {
    return new DataView(aByte.buffer).getUint16(Pos, true);
  },

  /*****************************************************
  * Load32LE(): Reads an U32 parameter from a byte array
  */
  Load32LE:function(aByte, Pos) {
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
    Bit  = CapEx & 7;
    if (this._aCapsEx[Byte] & (1 << Bit)) {
      return true;
    }
    return false;
  },
    /*****************************************************
  * UpdateConTable(): Register/Unregister the connection with the J-Link.
  */
  UpdateConTable: async function(SubCmd) {
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
    Handle                      = 0;                    // Not registered yet
    aDataDown                   = new Uint8Array(1 + 1 + 4 + 4 + 1 + 1 + 2);
    this.Store8LE (aDataDown,  0, this.EMU_CMD_REGISTER);  // <Cmd>
    this.Store8LE (aDataDown,  1, SubCmd);                     // <SubCmd>
    this.Store32LE(aDataDown,  2, this._MAIN_PIDx);        // <PIDx>
    this.Store32LE(aDataDown,  6, this._MAIN_HostId);      // <HID>
    this.Store8LE (aDataDown, 10, 0);                          // <IID>
    this.Store8LE (aDataDown, 11, 0);                          // <CID>
    this.Store16LE(aDataDown, 12, Handle);                     // <Handle>
    JlinkCom._ActiveCmd.NumBytesReceived = 0;
    this._USBPort.Send(aDataDown, null, this.EventUSBOnSendError); // Queue write
    NumBytesExpected = 12 + (4 * 16);
    aBuf = await this.USBRead(NumBytesExpected);
    Handle        = this.Load16LE(aBuf, 0);                 // Handle
    NumConInfos   = this.Load16LE(aBuf, 2);                 // NumConInfos
    SizeOfConInfo = this.Load16LE(aBuf, 4);                 // SizeOfConInfo
    NumBytesAdd   = this.Load16LE(aBuf, 6);                 // NumBytesAdd
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
        PID:    this.Load32LE(aBuf, Pos +  0),
        HID:    this.Load32LE(aBuf, Pos +  4),
        IID:    this.Load8LE (aBuf, Pos +  8),
        CID:    this.Load8LE (aBuf, Pos +  9),
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
  ConnectTarget: async function() {
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
    if (this.IsEmuHasCapEx(this.EMU_CAP_EX_SET_EMU_OPTION) == true) {
      MaxTransferSize = 2048;           				  // 2K mode
      aDataDown       = new Uint8Array(1 + 4 + 4 + 2 + 6);
      this.Store8LE (aDataDown, 0, this.EMU_CMD_SET_EMU_OPTION);
      this.Store32LE(aDataDown, 1, 5);                      // Option == SET_MAX_TRANSFER_SIZE
      this.Store32LE(aDataDown, 5, MaxTransferSize);
      this.Store16LE(aDataDown, 9, 0);                      // Dummy handle == 0 as it is not needed for <OptionType>
      this.Store8LE (aDataDown, 11,0);                      // Dummy
      this.Store8LE (aDataDown, 12,0);                      // Dummy
      this.Store8LE (aDataDown, 13,0);                      // Dummy
      this.Store8LE (aDataDown, 14,0);                      // Dummy
      this.Store8LE (aDataDown, 15,0);                      // Dummy
      this.Store8LE (aDataDown, 16,0);                      // Dummy
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
      this.Store8LE (aDataDown, 0, this.EMU_CMD_SET_SPEED);
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
  InitDAP:async function() {
    var AccDescList;
    const APConfig = (2 <<  0)      // Access size: word
                   | (1 <<  4)      // No auto increment
                   | (1 << 24)      // Reserved
                   | (1 << 25)      // Private access
                   | (1 << 29)      // MasterType == Debug
                   ;
  
    this.LogOut("Initialize DAP");
    AccDescList = [
      { //
        // Clear AP error flags
        //
        Data:               0x1E,
        RegIndex:           this.JLINK_CORESIGHT_DP_REG_ABORT,
        APnDP:              this.JLINK_CORESIGHT_DP,
        RnW:                0,
      },
      { //
        // Set CSYSPWRUPREQ and CDBGPWRUPREQ
        //
        Data:               ((1 << 30) | (1 << 28)),
        RegIndex:           this.JLINK_CORESIGHT_DP_REG_CTRL_STAT,
        APnDP:              this.JLINK_CORESIGHT_DP,
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
        RegIndex:           this.JLINK_CORESIGHT_DP_REG_CTRL_STAT,
        APnDP:              this.JLINK_CORESIGHT_DP,
        RnW:                1,
      },
      {
        //
        // Select AP and AP bank to be used.
        //
        Data:               0, // Select bank 0, index 0
        RegIndex:           this.JLINK_CORESIGHT_DP_REG_SELECT,
        APnDP:              this.JLINK_CORESIGHT_DP,
        RnW:                0,
      },
      {
        //
        // Perform "one-time" AP setup like access width to be used for memory accesses via the AP.
        //
        Data:               APConfig,
        RegIndex:           this.JLINK_CORESIGHT_AP_REG_CTRL,
        APnDP:              this.JLINK_CORESIGHT_AP,
        RnW:                0,
      },
    ];
    await this.EmuCoreSightPerformDAPAcc(AccDescList);
  },
  EmuCoreSightConfigure: async function(ConfigString) {
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
    this.Store8LE (aDataDown, 0, this.EMU_CMD_CORESIGHT);
    this.Store8LE (aDataDown, 1, this._MAIN_Stat.ConIndex);
    this.Store8LE (aDataDown, 2, this.EMU_CMD_CORESIGHT_CMD_CONFIG);
    this.Store8LE (aDataDown, 3, 0);                                 // Dummy
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
  CoreSightReadDAP: async function(RegIndex, ApnDP) {
      var AccDesc;
      AccDesc = {
          RegIndex:           RegIndex,
          APnDP:              ApnDP,
          RnW:                this.JLINK_CORESIGHT_READ,
        };
      await this.EmuCoreSightPerformDAPAcc([AccDesc]);
      if (AccDesc.Status) {
        throw new Error("CoreSight read DAP failed: " + AccDesc);
      }
      return AccDesc.Data;
  },
  ReadMem32:async function (Addr, Length) {
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
      Data:               Addr,
      RegIndex:           this.JLINK_CORESIGHT_AP_REG_ADDR,
      RnW:                this.JLINK_CORESIGHT_WRITE,
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
  WriteMem32:async function(Addr, aData) {
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
        obj.Data = aData[index -1];
      }
    });
    await this.EmuCoreSightPerformDAPAcc(AccDescList);
  },
  EmuCoreSightPerformDAPAcc:async function(paAccDesc) {
    const HEADER_SIZE    = 4+4;
    const ACC_DESC_SIZE  = 20;
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
    this.Store8LE (aDataDown, 0, this.EMU_CMD_CORESIGHT);
    this.Store8LE (aDataDown, 1, this._MAIN_Stat.ConIndex);
    this.Store8LE (aDataDown, 2, this.EMU_CMD_CORESIGHT_CMD_DAP_ACC);
    this.Store8LE (aDataDown, 3, 0);                                             // Dummy for alignment
    this.Store32LE(aDataDown, 4, NumEntries);
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
      if (paAccDesc[i].RegIndex           == undefined) { paAccDesc[i].RegIndex           = this.JLINK_CORESIGHT_AP_REG_DATA; }
      if (paAccDesc[i].APnDP              == undefined) { paAccDesc[i].APnDP              = this.JLINK_CORESIGHT_AP; }
      if (paAccDesc[i].RnW                == undefined) { paAccDesc[i].RnW                = this.JLINK_CORESIGHT_READ; }
      //
      // Fill transfer buffer
      //
      this.Store32LE(aDataDown, Pos, paAccDesc[i].Data);               Pos += 4;
      this.Store32LE(aDataDown, Pos, paAccDesc[i].Mask);               Pos += 4;
      this.Store32LE(aDataDown, Pos, paAccDesc[i].CompVal);            Pos += 4;
      this.Store32LE(aDataDown, Pos, paAccDesc[i].TimeoutMsReadUntil); Pos += 4;
      this.Store8LE (aDataDown, Pos, paAccDesc[i].RegIndex);           Pos += 1;
      this.Store8LE (aDataDown, Pos, paAccDesc[i].APnDP);              Pos += 1;
      this.Store8LE (aDataDown, Pos, paAccDesc[i].RnW);                Pos += 1;
      this.Store8LE (aDataDown, Pos, 0);                               Pos += 1; // Dummy for alignment
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
        paAccDesc[i].Data   = this.Load32LE(aBuf, (i * RESP_SIZE) + 4);
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
  ToHexString:function(num, hasPrefix) {
    return (hasPrefix ? "0x" : "") + num.toString(16).padStart(8, "0").toUpperCase();
  },
  USBRead: async function(NumBytes) {
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
  EventUSBOnRecvError:function(error) {
    this.EventOnError("USB receive error: " + error);
  },
  EventUSBOnRecv:function(data) {
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

var JlinkArmWebUsbFW = {
  /*********************************************************************
*         Copyright [2023] Renesas Electronics Corporation           *
*                           www.renesas.com                          *
**********************************************************************

-------------------------- END-OF-HEADER -----------------------------

File    : jlinkarmwebusbfw.js
Purpose : Implementation of J-Link Web USB firmware for Renesas RA devices
Literature:
  [1]  ...

Additional information:
  <Any additional information for module>
*/

/*****************************************************
* Class definition
*/
    /*********************************************************************
     *
     *       Defines
     *
     **********************************************************************
    */
    //
    // System registers
    //
    // DHCSR
    ARM_CM_REG_DHCSR                            : 0xE000EDF0,
    ARM_CM_REG_DHCSR_DBGKEY                     : 0xA05F0000,
    ARM_CM_REG_DHCSR_C_DEBUGEN_ON               : 0x1,
    ARM_CM_REG_DHCSR_C_DEBUGEN_OFF              : 0x0,
    ARM_CM_REG_DHCSR_C_HALT_ON                  : 0x2,
    ARM_CM_REG_DHCSR_C_HALT_OFF                 : 0x0,
    ARM_CM_REG_DHCSR_C_MASKINTS_ON              : 0x8,
    ARM_CM_REG_DHCSR_C_STEPS_ON                 : 0x4,
   // AIRCR
    ARM_CM_REG_AIRCR                            : 0xE000ED0C,
    ARM_CM_REG_AIRCR_VECTKEY                    : 0x05FA0000,
    ARM_CM_REG_AIRCR_SYSRESETREQ_ON             : 0x4,
   //DFSR
    ARM_CM_REG_DFSR                             : 0xE000ED30,
   //DEMCR
    ARM_CM_REG_DEMCR                            : 0xE000EDFC,

   //FPB
    ARM_CM_REG_FP_CTRL                          : 0xE0002000,
    ARM_CM_REG_FP_REMAP                         : 0xE0002004,
    ARM_CM_REG_FP_LSR                           : 0xE0002FB4,
    ARM_CM_REG_FP_COMP                          : 0xE0002008,
    ARM_CM_REG_FP_CTRL_ENABLE_ON                : 0x1,
    ARM_CM_REG_FP_CTRL_KEY_ON                   : 0x2,
    /*********************************************************************
     *
     *       Public functions
     *
     **********************************************************************
    */
  // ToHexString:function(num, hasPrefix) {
  //     return (hasPrefix ? "0x" : "") + num.toString(16).padStart(8, "0").toUpperCase();
  // },
  WFW_Connect: async function(){
    if (JlinkCom._IsConnected) {
      JlinkCom.LogOut("USB port already connected");
      return;
    }
    else {
        await JlinkCom.UsbConnect();
    }
  },
  WFW_Disconnect:async function() {
    await JlinkCom.UsbDisConnect();
  },
  WFW_Reset:async function() {
    let readData;
    var dataArr = new Uint32Array(1);
    // Clear history reset flag (DHCSR.RESET_ST == 0)
    JlinkCom.LogOut("Clear history reset flag (DHCSR.RESET_ST == 0)");
    while (true) {
        dataArr = await JlinkCom.ReadMem32(this.ARM_CM_REG_DHCSR, 1);
        JlinkCom.LogOut("readData = " + JlinkCom.ToHexString(dataArr[0], true));
        readData = ((dataArr[0] >> 25) & 0x1) >>> 0;
        if (readData == 0) {
          JlinkCom.LogOut("First clear RESET_ST");
        break;
        }
    }
    // Reset by writing to SYSRESETREQ
    JlinkCom.LogOut("Reset by writing to SYSRESETREQ");
    dataArr[0] = (this.ARM_CM_REG_AIRCR_VECTKEY | this.ARM_CM_REG_AIRCR_SYSRESETREQ_ON) >>> 0;
    JlinkCom.LogOut("Data to write: " + JlinkCom.ToHexString(dataArr[0], true));
    await JlinkCom.WriteMem32(this.ARM_CM_REG_AIRCR, dataArr);

    // Re-Authentication (Some CM devices require authorize after reseting)

    // Wait for reset is performed (DHCSR.RESET_ST == 1)
    JlinkCom.LogOut("Wait for reset is performed (DHCSR.RESET_ST == 1)");
    while (true) {
        dataArr = await JlinkCom.ReadMem32(this.ARM_CM_REG_DHCSR, 1);
        readData = ((dataArr[0] >> 25) & 0x1) >>> 0;
        if (readData == 1) {
          JlinkCom.LogOut("RESET_ST = 1");
        break;
        }
    }
    // Clear history reset flag (DHCSR.RESET_ST == 0)
    JlinkCom.LogOut("Clear history reset flag (DHCSR.RESET_ST == 0)");
    while (true) {
        dataArr = await JlinkCom.ReadMem32(this.ARM_CM_REG_DHCSR, 1);
        JlinkCom.LogOut("readData = " + JlinkCom.ToHexString(dataArr[0], true));
        readData = ((dataArr[0] >> 25) & 0x1) >>> 0;
        if (readData == 0) {
          JlinkCom.LogOut("Clear RESET_ST");
        break;
        }
    }
 },
    /*****************************************************
   * WFW_Halt(): Halt target device
   */
  WFW_Halt:async function() {
    var dataArr = new Uint32Array(1);
    let readData;
    JlinkCom.LogOut("check C_HALT (DHCSR.C_HALT == 0)");
    while (true) {
        dataArr = await JlinkCom.ReadMem32(this.ARM_CM_REG_DHCSR_DBGKEY, 1);
        JlinkCom.LogOut("readData = " + JlinkCom.ToHexString(dataArr[0], true));
        readData = ((dataArr[0] >> 1) & 0x1) >>> 0;
        if (readData == 0) {
          JlinkCom.LogOut("First clear C_HALT");
        break;
        }
    }
    JlinkCom.LogOut("Halt by writing to C_DEBUGEN");
    dataArr[0] = (this.ARM_CM_REG_DHCSR | this.ARM_CM_REG_DHCSR_C_DEBUGEN_ON) >>> 0;
    JlinkCom.LogOut("Data to write: " + JlinkCom.ToHexString(dataArr[0], true));
    await JlinkCom.WriteMem32(this.ARM_CM_REG_DHCSR, dataArr);
    JlinkCom.LogOut("Halt by writing to C_HALT");
    dataArr[0] = (this.ARM_CM_REG_DHCSR | this.ARM_CM_REG_DHCSR_C_HALT_ON) >>> 0;
    JlinkCom.LogOut("Data to write: " + JlinkCom.ToHexString(dataArr[0], true));
    await JlinkCom.WriteMem32(this.ARM_CM_REG_DHCSR, dataArr);
    JlinkCom.LogOut("check C_HALT (DHCSR.C_HALT == 1)");
    while (true) {
        dataArr = await JlinkCom.ReadMem32(this.ARM_CM_REG_DHCSR_DBGKEY, 1); 
        JlinkCom.LogOut("readData = " + JlinkCom.ToHexString(dataArr[0], true));
        readData = ((dataArr[0] >> 1) & 0x1) >>> 0;
        if (readData == 1) {
          JlinkCom.LogOut("Hating is successful");
        break;
        }
    }
  },
      /*****************************************************
     * WFW_UnHalt(): UnHalt target device
    */
  WFW_UnHalt: async function() {
    var dataArr = new Uint32Array(1);
    var readData;
    JlinkCom.LogOut("check C_HALT (DHCSR.C_HALT == 1)");
    while (true) {
        dataArr = await JlinkCom.ReadMem32(this.ARM_CM_REG_DHCSR_DBGKEY, 1); 
        JlinkCom.LogOut("readData = " + JlinkCom.ToHexString(dataArr[0], true));
        readData = ((dataArr[0] >> 1) & 0x1) >>> 0;
        if (readData == 1) {
          JlinkCom.LogOut("Read DHCSR.C_HALT == 1)");
        break;
        }
    }
    JlinkCom.LogOut("Halt by writing to C_DEBUGEN");
    dataArr[0] = (this.ARM_CM_REG_DHCSR | this.ARM_CM_REG_DHCSR_C_DEBUGEN_OFF) >>> 0;
    JlinkCom.LogOut("Data to write: " + JlinkCom.ToHexString(dataArr[0], true));
    await JlinkCom.WriteMem32(this.ARM_CM_REG_DHCSR, dataArr);
    JlinkCom.LogOut("Halt by writing to C_HALT");
    dataArr[0] = (this.ARM_CM_REG_DHCSR | this.ARM_CM_REG_DHCSR_C_HALT_OFF) >>> 0;
    JlinkCom.LogOut("Data to write: " + JlinkCom.ToHexString(dataArr[0], true));
    await JlinkCom.WriteMem32(this.ARM_CM_REG_DHCSR, dataArr);
    JlinkCom.LogOut("check C_HALT (DHCSR.C_HALT == 0)");
    while (true) {
        dataArr = await JlinkCom.ReadMem32(this.ARM_CM_REG_DHCSR_DBGKEY, 1); 
        JlinkCom.LogOut("readData = " + JlinkCom.ToHexString(dataArr[0], true));
        readData = ((dataArr[0] >> 1) & 0x1) >>> 0;
        if (readData == 0) {
          JlinkCom.LogOut("unhalting is successful");
        break;
        }
    }
  },
   /*****************************************************
     * WFW_Breakpoint(): Breakpoint target device
     */
  WFW_Breakpoint: async function(){
    var dataArr = new Uint32Array(1);
    let numCode4_7Val;
    let numCode12_14Val;
    let num_Code;
    let num_Lit;
    let n;
    let m;
    let p;
    JlinkCom.LogOut("beakpoint start");
    dataArr = await JlinkCom.ReadMem32(this.ARM_CM_REG_FP_CTRL, 1); 
    JlinkCom.LogOut("readData= " + JlinkCom.ToHexString(dataArr[0], true));
    numCode4_7Val = ((dataArr[0] >> 4) & 0xF ) >>> 0;
    numCode12_14Val = ((numCode4_7Val >> 12) & 0x7) >>> 0;
    num_Lit = (dataArr[0] >> 8) & 0xF;
    num_Code =  (numCode12_14Val << 4) | numCode4_7Val;
    n = num_Code - 1;
    JlinkCom.LogOut("readData n= " + n);
    m = num_Code;
    JlinkCom.LogOut("readData num_Code= " + m);
    p = num_Code + num_Lit - 1;
    JlinkCom.LogOut("readData p= " + p);
    JlinkCom.LogOut("beakpoint is successful");
  }
}
 async function PerformOperations(){
  try {
    await JlinkArmWebUsbFW.WFW_Connect();
    await JlinkArmWebUsbFW.WFW_Reset();
    await JlinkArmWebUsbFW.WFW_Halt();
    await JlinkArmWebUsbFW.WFW_UnHalt();
    await JlinkArmWebUsbFW.WFW_Breakpoint();
    await JlinkArmWebUsbFW.WFW_Disconnect();
  } catch (error) {
    console.log(error);
  }
};

async function WFW_Connect(){
  try {
    await JlinkArmWebUsbFW.WFW_Connect();
  } catch (error) {
    console.log(error);
  }
};
async function WFW_Reset(){
  try {
    await JlinkArmWebUsbFW.WFW_Reset();
  } catch (error) {
    console.log(error);
  }
};
async function WFW_Halt(){
  try {
    await JlinkArmWebUsbFW.WFW_Halt();
  } catch (error) {
    console.log(error);
  }
};
async function WFW_UnHalt(){
  try {
    await JlinkArmWebUsbFW.WFW_UnHalt();
  } catch (error) {
    console.log(error);
  }
};
async function WFW_Breakpoint(){
  try {
    await JlinkArmWebUsbFW.WFW_Breakpoint();
  } catch (error) {
    console.log(error);
  }
};
async function WFW_Disconnect(){
  try {
    await JlinkArmWebUsbFW.WFW_Disconnect();
  } catch (error) {
    console.log(error);
  }
};


Module = {
  $SeggerBulk: SeggerBulk,
  $JlinkCom: JlinkCom,
  $JlinkArmWebUsbFW: JlinkArmWebUsbFW,
  WFW_Connect: WFW_Connect,
  WFW_Reset: WFW_Reset,
  WFW_Halt:WFW_Halt,
  WFW_UnHalt:WFW_UnHalt,
  WFW_Disconnect:WFW_Disconnect
};
autoAddDeps(Module, '$SeggerBulk');
autoAddDeps(Module, '$JlinkCom');
autoAddDeps(Module, '$JlinkArmWebUsbFW');
mergeInto(LibraryManager.library, Module);