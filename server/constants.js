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
    connectionReset: 'connectionReset',
    end: 'end',
    textL: 'text',
    authenticate: 'authenticate',
    connected: 'connected',
    error: 'error',
    focus: 'focus',
    path: 'path',
    redraw: 'redraw',
    render: 'render',
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
