'use strict';

const version = require('../package').version;

const banner = `
   ....                                                                ':c:,.
  cOdc;..,,.                                                           ..;OXK;
 ,Kl  .dKXk'                                                             .OXXl
 cK;  'KXd                                                            .,ckXKk.
 :Xl   lKd.                                                     .';ldOXXXOl' ..
 .OKo.  ;x:,xx.                                         .';:clllodolcc:,'. .;kO,
  ;KX0;  .lkKK'                                     ,ldOOdoc,.    .',,;:cokKXXx.
   .ck0d:...,dc                                 'ldOxc;'..     .:cccc:::;:::;'
      c0XKd,. '.                             .ckK0d;    ,0kc.               .,
       .;o0X0xl;'.   .,c;,.                .l0XXd.      cXXXc ',;:ccccllodxxkc
          .:d0XXXKo';OO;..    .';;,..lxl..c0XX0c       ,0XXO,           ..''.
             .c0XXXKKKkdlc:. .:ollxx'.lXK0XXXd.      ,d0X0o.  ',;clooc;,''.
               .l0XXKKXldkk; .x0k, xo ;KXXXXx      .dXX0l.  .c:,.  ..:oxko.
                 .kXKkOkO00d,:xkx;;k, ;KXXX0,   .codl,..   .,,;codocc,
                  .o0k;:oc.:kc..;oo'   'kX0:   ;d;.      .lxocc;. ....
                    .l:  .     .;.      .kl   .l.   ....,xXXc
                     .'                  .. ..   ';:okxxkkxl.
                     :K'                  .;ldxd:,'.cO'
                     cXl                  .  ..;d0KK0o.
                     cX0,                c0;     .''.
                     'OX0l.             ,OXo
                      :KXX0:           .OXXo    ,dl.
                       oXXXKx:.  ...  .dXXXKkxkO0o.
                       ,KX0l'.  l0Xo   dXXXXXK0kl,;:.
                  .lo:cdc,.   .'0Xx.   .d0XXXXK0kl;.
                  :kXOc.    .dOxOd:.     .,;:;,.
                   ;d,      ,odO,.cx.
                               .  .'
`;

const owl = `{o,o}
./)_)
  ""`;

const owlPrompt = `{o,o}
./)_)   %s
  ""`;

const athena = `                    _   _   _
                   / \\ | |_| |__   ___ _ __   __ _
                  / _ \\| __| '_ \\ / _ \\ '_ \\ / _\` |
                 / ___ \\ |_| | | |  __/ | | | (_| |
                /_/   \\_\\__|_| |_|\\___|_| |_|\\__,_| v${ version }
`;
module.exports = {
  version,
  assets: {
    athena,
    banner,
    owl,
    owlPrompt
  },
  style: {
    blue: 'DodgerBlue1'
  },
  health: { // Implicit ordering
    healthy: 'healthy',
    unknown: 'unknown',
    unstable: 'unstable',
    error: 'error',
    failed: 'failed'
  },
  message: {
    action: 'action',
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
      icon: 'bank',
      parent: null,
      sync: false,
      ephemeral: true
    },
    athena: {
      name: 'athena',
      id: 'athena',
      type: 'athena',
      parent: 'root',
      sync: false,
      ephemeral: true,
      triggers: [
        'interval: 30000'
      ]
    }
  }
};
