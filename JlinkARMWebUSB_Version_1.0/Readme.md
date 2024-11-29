Generate a WebAssembly file using the Emscripten compiler by executing the appropriate git bash command:
emcc main.cpp  --js-library jlinkcom.js --js-library seggerbulk.js --js-library jlinkarmwebusbfw.js -sASYNCIFY -s FILESYSTEM=1  -s ENVIRONMENT=web,worker -s INVOKE_RUN=0 -s EXPORT_ES6=0 -s USE_ES6_IMPORT_META=0 -s ALLOW_MEMORY_GROWTH=1 -s EXIT_RUNTIME=1 -s EXPORTED_FUNCTIONS=['_GetVersionFile,_ConnectController,_DisConnectController,_ResetController,_HaltController,_UnHaltController,_BreakpointController,_main'] -s EXPORTED_RUNTIME_METHODS='["cwrap"]' -o output.html

To build the application, execute the following windows command:
py -m http.server 8080