'use strict';

const banner = `
                                                             .,,,
 .#%#(. .                                                     ,*#
.(#, .%&&/.                                                    .(&&.
,#(. .,                                                   ,*%&&%/
.(%/  /%( ..                                         .,/##&&&%#/, ./,
 ,&&*. ,((%#.                                 ,*##%%#/*,..    .,*#&
  /%.  (##,                              ./#%%(*,    ,*/####%&&&%/.
    /%&%(. *(/                          ,#&&(,  .//   .,..
      *#&&&(*,     ,/(/              .*&&%/.    /%,,*(########(%&,
         *(&&&&%**%(,..   .,*, .##*.*&&      .%&&(.         ..,.
            *#&&&&%%%/*,..**,/,#&&&&&*      #&&  ,,/(#%%(/**,
              *%&&/&&(.#&,##,#&&&%/    .#%#(.  .*##/*.  .,*,.
               *&%%%%(//#%/*%/,#&&&(.  ,/#(*     *,.,#%%##,
                ,#(,*(,*#,  (#.   *%&.  ,#*.     .//*((.
                  ,.               ,*   .  .*/((#%,
                  /(.               .*//*..,.*(*,,,
                  #%/                  .*%&&&&(.
                  #&&.             ,#.     ...
                  /%&%/           ,#&*
                  ,#&&&*.         (&&*   ,/(
                   ./&&&&/. ...../&&&&&&&&(,
                   ,(%#.   .%&*. .%&&&&%%###*.
               .%&%(*    */*&(    .*(%%##,.
                ,#,     ,%%&**%*
                          ,/ .*.
`;

const owl = `{o,o}
./)_)
  ""`;

const owlPrompt = `{o,o}
./)_)   %s
  ""`;

const athena = `               _   _   _
              / \\ | |_| |__   ___ _ __   __ _
             / _ \\| __| '_ \\ / _ \\ '_ \\ / _\` |
            / ___ \\ |_| | | |  __/ | | | (_| |
           /_/   \\_\\__|_| |_|\\___|_| |_|\\__,_|
`;
module.exports = {
  assets: {
    athena,
    banner,
    owl,
    owlPrompt
  },
  style: {
    blue: 'DodgerBlue1'
  },
  health: {
    healthy: 'healthy',
    unstable: 'unstable',
    error: 'error',
    failed: 'failed',
    unknown: 'unknown'
  },
  message: {
    authenticate: 'authenticate',
    connected: 'connected',
    connectionReset: 'connectionReset',
    end: 'end',
    error: 'error',
    focus: 'focus',
    path: 'path',
    ping: 'PING',
    pong: 'PONG',
    redraw: 'redraw',
    render: 'render',
    send: 'send',
    text: 'text',
    update: 'update'
  },
  nodes: {
    root: {
      name: 'root',
      id: 'root',
      parent: null,
      sync: false,
      ephemeral: true
    },
    athena: {
      name: 'athena',
      id: 'athena',
      parent: 'root',
      sync: false,
      ephemeral: true
    }
  }
};
