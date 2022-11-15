const icons = {
    HOME_PIENA: `<path d="M13.5 1.515a3 3 0 00-3 0L3 5.845a2 2 0 00-1 1.732V21a1 1 0 001 1h6a1 1 0 001-1v-6h4v6a1 1 0 001 1h6a1 1 0 001-1V7.577a2 2 0 00-1-1.732l-7.5-4.33z"></path>`,
    HOME_VUOTA: `<path d="M12.5 3.247a1 1 0 00-1 0L4 7.577V20h4.5v-6a1 1 0 011-1h5a1 1 0 011 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 013 0l7.5 4.33a2 2 0 011 1.732V21a1 1 0 01-1 1h-6.5a1 1 0 01-1-1v-6h-3v6a1 1 0 01-1 1H3a1 1 0 01-1-1V7.577a2 2 0 011-1.732l7.5-4.33z"></path>`,
    CERCA_PIENA: `<path d="M15.356 10.558c0 2.623-2.16 4.75-4.823 4.75-2.664 0-4.824-2.127-4.824-4.75s2.16-4.75 4.824-4.75c2.664 0 4.823 2.127 4.823 4.75z"></path><path d="M1.126 10.558c0-5.14 4.226-9.28 9.407-9.28 5.18 0 9.407 4.14 9.407 9.28a9.157 9.157 0 01-2.077 5.816l4.344 4.344a1 1 0 01-1.414 1.414l-4.353-4.353a9.454 9.454 0 01-5.907 2.058c-5.18 0-9.407-4.14-9.407-9.28zm9.407-7.28c-4.105 0-7.407 3.274-7.407 7.28s3.302 7.279 7.407 7.279 7.407-3.273 7.407-7.28c0-4.005-3.302-7.278-7.407-7.278z"></path>`,
    CERCA_VUOTA: `<path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 101.414-1.414l-4.344-4.344a9.157 9.157 0 002.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z"></path>`,
    LIBRERIA: `<path d="M14.5 2.134a1 1 0 011 0l6 3.464a1 1 0 01.5.866V21a1 1 0 01-1 1h-6a1 1 0 01-1-1V3a1 1 0 01.5-.866zM16 4.732V20h4V7.041l-4-2.309zM3 22a1 1 0 01-1-1V3a1 1 0 012 0v18a1 1 0 01-1 1zm6 0a1 1 0 01-1-1V3a1 1 0 012 0v18a1 1 0 01-1 1z"></path>`,
    CROCE: `<path d="M3.293 3.293a1 1 0 011.414 0L12 10.586l7.293-7.293a1 1 0 111.414 1.414L13.414 12l7.293 7.293a1 1 0 01-1.414 1.414L12 13.414l-7.293 7.293a1 1 0 01-1.414-1.414L10.586 12 3.293 4.707a1 1 0 010-1.414z"></path>`,
    IMPOSTAZIONI: `<path d="M23.2 11.362l-1.628-.605a.924.924 0 01-.52-.7.88.88 0 01.18-.805l1.2-1.25a1 1 0 00.172-1.145 12.075 12.075 0 00-3.084-3.865 1 1 0 00-1.154-.086l-1.35.814a.982.982 0 01-.931-.02 1.01 1.01 0 01-.59-.713l-.206-1.574a1 1 0 00-.787-.848 12.15 12.15 0 00-4.945 0 1 1 0 00-.785.848l-.2 1.524a1.054 1.054 0 01-.62.747 1.024 1.024 0 01-.968.02l-1.318-.795a1 1 0 00-1.152.086 12.118 12.118 0 00-3.085 3.867 1 1 0 00.174 1.143l1.174 1.218a.91.91 0 01.182.828.949.949 0 01-.532.714l-1.618.6a1 1 0 00-.653.955 12.133 12.133 0 001.1 4.822 1 1 0 001 .578l1.935-.183a.83.83 0 01.654.327.794.794 0 01.188.726l-.6 1.822a1 1 0 00.34 1.106c.66.504 1.369.94 2.117 1.3.748.36 1.532.642 2.338.841a.988.988 0 00.715-.09 1 1 0 00.362-.332l1.136-1.736a.81.81 0 011.16.022l1.124 1.714a1 1 0 001.077.422c1.617-.4 3.133-1.13 4.454-2.145a1 1 0 00.341-1.106l-.613-1.859a.771.771 0 01.18-.7.78.78 0 01.635-.317l1.945.183a.994.994 0 001-.578 12.133 12.133 0 001.1-4.822 1 1 0 00-.643-.953zm-1.6 2.977c-.103.448-.237.888-.4 1.318l-1.213-.115a2.851 2.851 0 00-2.9 3.637l.383 1.16a10.09 10.09 0 01-2.473 1.191l-.72-1.1a2.691 2.691 0 00-2.275-1.18 2.637 2.637 0 00-2.232 1.16l-.735 1.12a10.117 10.117 0 01-2.471-1.19l.37-1.125a2.879 2.879 0 00-2.93-3.669l-1.2.113a10.46 10.46 0 01-.4-1.317 10.09 10.09 0 01-.214-1.358l.93-.345a3.032 3.032 0 001.095-4.8L3.55 7.15a10.158 10.158 0 011.71-2.146l.688.415a3 3 0 002.875.066 3.022 3.022 0 001.726-2.283l.105-.8a10.174 10.174 0 012.745 0l.11.844a3.099 3.099 0 004.542 2.184l.721-.435a10.22 10.22 0 011.712 2.146l-.694.72a3.005 3.005 0 001.084 4.768l.942.35c-.042.457-.113.912-.215 1.36H21.6zM12 7.001a5 5 0 105 5 5.006 5.006 0 00-4.993-5H12zm0 8a3 3 0 11.007 0H12z"></path>`,
    MENU: `<path d="M8 3a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM8 16a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"></path>`,
    LIKE: `<path d="M5.21 1.57a6.757 6.757 0 016.708 1.545.124.124 0 00.165 0 6.741 6.741 0 015.715-1.78l.004.001a6.802 6.802 0 015.571 5.376v.003a6.689 6.689 0 01-1.49 5.655l-7.954 9.48a2.518 2.518 0 01-3.857 0L2.12 12.37A6.683 6.683 0 01.627 6.714 6.757 6.757 0 015.21 1.57zm3.12 1.803a4.757 4.757 0 00-5.74 3.725l-.001.002a4.684 4.684 0 001.049 3.969l.009.01 7.958 9.485a.518.518 0 00.79 0l7.968-9.495a4.688 4.688 0 001.049-3.965 4.803 4.803 0 00-3.931-3.794 4.74 4.74 0 00-4.023 1.256l-.008.008a2.123 2.123 0 01-2.9 0l-.007-.007a4.757 4.757 0 00-2.214-1.194z"></path>`,
    LIKE_FULL: `<path d="M8.667 1.912a6.257 6.257 0 00-7.462 7.677c.24.906.683 1.747 1.295 2.457l7.955 9.482a2.015 2.015 0 003.09 0l7.956-9.482a6.188 6.188 0 001.382-5.234l-.49.097.49-.099a6.303 6.303 0 00-5.162-4.98h-.002a6.24 6.24 0 00-5.295 1.65.623.623 0 01-.848 0 6.257 6.257 0 00-2.91-1.568z"></path>`,
    SHARE: `<path d="M18.5 4a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM15 5.5a3.5 3.5 0 111.006 2.455L9 12l7.006 4.045a3.5 3.5 0 11-.938 1.768l-6.67-3.85a3.5 3.5 0 110-3.924l6.67-3.852A3.513 3.513 0 0115 5.5zm-9.5 5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm13 6.5a1.5 1.5 0 10-.001 3 1.5 1.5 0 00.001-3z"></path>`,
    SONG: `<path d="M15 4v12.167a3.5 3.5 0 11-3.5-3.5H13V4h2zm-2 10.667h-1.5a1.5 1.5 0 101.5 1.5v-1.5z"></path>`,
    DISC: `<path d="M12 3a9 9 0 100 18 9 9 0 000-18zM1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12z"></path><path d="M12 10a2 2 0 100 4 2 2 0 000-4zm-4 2a4 4 0 118 0 4 4 0 01-8 0z"></path>`,
    ARTIST: `<path d="M13.363 10.474l-.521.625a2.499 2.499 0 00.67 3.766l.285.164a5.998 5.998 0 011.288-1.565l-.573-.33a.5.5 0 01-.134-.754l.52-.624a7.372 7.372 0 001.837-4.355 7.221 7.221 0 00-.29-2.489 5.644 5.644 0 00-3.116-3.424A5.771 5.771 0 006.753 2.87a5.7 5.7 0 00-1.19 2.047 7.22 7.22 0 00-.29 2.49 7.373 7.373 0 001.838 4.355l.518.622a.5.5 0 01-.134.753L3.5 15.444a5 5 0 00-2.5 4.33v2.231h13.54a5.981 5.981 0 01-1.19-2H3v-.23a3 3 0 011.5-2.6l3.995-2.308a2.5 2.5 0 00.67-3.766l-.521-.625a5.146 5.146 0 01-1.188-4.918 3.71 3.71 0 01.769-1.334 3.769 3.769 0 015.556 0c.346.386.608.84.768 1.334.157.562.22 1.146.187 1.728a5.379 5.379 0 01-1.373 3.188zm7.641-1.173a1 1 0 00-1 1v4.666h-1a3 3 0 103 3v-7.666a.999.999 0 00-1.003-1h.003zm-1 8.666a1 1 0 11-1-1h1v1z"></path>`,
    DOWNLOAD: `<path d="M15.4,15.1c-0.3-0.3-0.7-0.3-1,0l-5.9,6.1V0.7C8.5,0.3,8.2,0,7.8,0C7.4,0,7.1,0.3,7.1,0.7v20.4L1.2,15   c-0.3-0.3-0.7-0.3-1,0s-0.3,0.8,0,1l7.1,7.3c0.3,0.3,0.7,0.3,1,0l7.1-7.3C15.7,15.9,15.7,15.4,15.4,15.1   C15.2,14.8,15.7,15.4,15.4,15.1z"/>`,
    PLAY: `<path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"></path>`,
    PAUSE: `<path d="M5.7 3a.7.7 0 00-.7.7v16.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V3.7a.7.7 0 00-.7-.7H5.7zm10 0a.7.7 0 00-.7.7v16.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V3.7a.7.7 0 00-.7-.7h-2.6z"></path>`,
    SKIP_FW: `<path d="M19.5 4h-3v6.678L4.5 3.75v16.5l12-6.928V20h3z"></path>`,
    SKIP_BACK: `<path d="M19.5 3.75l-12 6.928V4h-3v16h3v-6.678l12 6.928z"></path>`,
    ARROW_DOWN: `<path d="M2.793 8.043a1 1 0 011.414 0L12 15.836l7.793-7.793a1 1 0 111.414 1.414L12 18.664 2.793 9.457a1 1 0 010-1.414z"></path>`,
    QUEUE_ADD: `<path d="M3 6c-.55 0-1 .45-1 1v13c0 1.1.9 2 2 2h13c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1-.45-1-1V7c0-.55-.45-1-1-1zm17-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 9h-3v3c0 .55-.45 1-1 1s-1-.45-1-1v-3h-3c-.55 0-1-.45-1-1s.45-1 1-1h3V6c0-.55.45-1 1-1s1 .45 1 1v3h3c.55 0 1 .45 1 1s-.45 1-1 1z"/>`,
}