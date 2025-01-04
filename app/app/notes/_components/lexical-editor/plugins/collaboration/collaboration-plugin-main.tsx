// /**
//  * Copyright (c) Meta Platforms, Inc. and affiliates.
//  *
//  * This source code is licensed under the MIT license found in the
//  * LICENSE file in the root directory of this source tree.
//  *
//  */
// import type {Provider} from '@lexical/yjs';

// import {CollaborationPlugin} from '@lexical/react/LexicalCollaborationPlugin';
// import {Fragment, useCallback, useEffect, useRef, useState} from 'react';
// import * as Y from 'yjs';

// import {createWebRTCProvider, createWebsocketProvider} from './providers';
// import { CollaborationPluginLexical } from './collaboration-plugin-lexical';

// interface ActiveUserProfile extends UserProfile {
//   userId: number;
// }

// const entries: [string, string][] = [
//     ['Arabian', '#7d0000'],
//     ['Appaloosa', '#640000'],
//     ['Friesian', '#990000'],
//     ['Thoroughbred', '#bf0000'],
//     ['Warmblood', '#bf4000'],
//     ['Saddlebred', '#004000'],
//     ['Mustang', '#007f00'],
//     ['Trakehner', '#407f00'],
//     ['Quarter Horse', '#7f7f00'],
//     ['Clydesdale', '#000099'],
//     ['Paint', '#0000bf'],
//     ['Icelandic', '#0000ff'],
//     ['Andalusian', '#004040'],
//     ['Tennessee Walker', '#404040'],
//     ['Ukrainian Riding Horse', '#7f0040'],
//     ['Percheron', '#bf0040'],
//   ];
  
//   export interface UserProfile {
//     name: string;
//     color: string;
//   }
  
//   export function getRandomUserProfile(): UserProfile {
//     const entry = entries[Math.floor(Math.random() * entries.length)];
//     return {
//       color: entry[1],
//       name: entry[0],
//     };
//   }
// export default function CollabPlugin({children}: any) {
//   const providerName =
//     new URLSearchParams(window.location.search).get('provider') ?? 'webrtc';
//   const [userProfile, setUserProfile] = useState(() => getRandomUserProfile());
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const [yjsProvider, setYjsProvider] = useState<null | Provider>(null);
//   const [connected, setConnected] = useState(false);
//   const [activeUsers, setActiveUsers] = useState<ActiveUserProfile[]>([]);

//   const handleAwarenessUpdate = useCallback(() => {
//     const awareness = yjsProvider!.awareness!;
//     setActiveUsers(
//       Array.from(awareness.getStates().entries()).map(
//         ([userId, {color, name}]) => ({
//           color,
//           name,
//           userId,
//         }),
//       ),
//     );
//   }, [yjsProvider]);

//   const handleConnectionToggle = () => {
//     if (yjsProvider == null) {
//       return;
//     }
//     if (connected) {
//       yjsProvider.disconnect();
//     } else {
//       yjsProvider.connect();
//     }
//   };

//   useEffect(() => {
//     if (yjsProvider == null) {
//       return;
//     }

//     yjsProvider.awareness.on('update', handleAwarenessUpdate);

//     return () => yjsProvider.awareness.off('update', handleAwarenessUpdate);
//   }, [yjsProvider, handleAwarenessUpdate]);

//   const providerFactory = useCallback(
//     (id: string, yjsDocMap: Map<string, Y.Doc>) => {
//       const provider =
//         providerName === 'webrtc'
//           ? createWebRTCProvider(id, yjsDocMap)
//           : createWebsocketProvider(id, yjsDocMap);
//       provider.on('status', (event) => {
//         setConnected(
//           // Websocket provider
//           event.status === 'connected' ||
//             // WebRTC provider has different approact to status reporting
//             ('connected' in event && event.connected === true),
//         );
//       });

//       // This is a hack to get reference to provider with standard CollaborationPlugin.
//       // To be fixed in future versions of Lexical.
//       setTimeout(() => setYjsProvider(provider), 0);

//       return provider;
//     },
//     [providerName],
//   );

//   return (
//     <div ref={containerRef}>
//       <p>
//         <b>Used provider:</b>{' '}
//         {providerName === 'webrtc'
//           ? 'WebRTC (within browser communication via BroadcastChannel fallback, unless run locally)'
//           : 'Websockets (cross-browser communication)'}
//         <br />
//         {window.location.hostname === 'localhost' ? (
//           providerName === 'webrtc' ? (
//             <a href="/app?provider=wss">Enable WSS</a>
//           ) : (
//             <a href="/app">Enable WebRTC</a>
//           )
//         ) : null}{' '}
//         {/* WebRTC provider doesn't implement disconnect correctly */}
//         {providerName !== 'webrtc' ? (
//           <button onClick={handleConnectionToggle}>
//             {connected ? 'Disconnect' : 'Connect'}
//           </button>
//         ) : null}
//       </p>
//       <p>
//         <b>My Name:</b>{' '}
//         <input
//           type="text"
//           value={userProfile.name}
//           onChange={(e) =>
//             setUserProfile((profile) => ({...profile, name: e.target.value}))
//           }
//         />{' '}
//         <input
//           type="color"
//           value={userProfile.color}
//           onChange={(e) =>
//             setUserProfile((profile) => ({...profile, color: e.target.value}))
//           }
//         />
//       </p>
//       <p>
//         <b>Active users:</b>{' '}
//         {activeUsers.map(({name, color, userId}, idx) => (
//           <Fragment key={userId}>
//             <span style={{color}}>{name}</span>
//             {idx === activeUsers.length - 1 ? '' : ', '}
//           </Fragment>
//         ))}
//       </p>
//         <CollaborationPluginLexical
//           id="lexical/react-rich-collab"
//           providerFactory={providerFactory}
//           // Unless you have a way to avoid race condition between 2+ users trying to do bootstrap simultaneously
//           // you should never try to bootstrap on client. It's better to perform bootstrap within Yjs server.
//           shouldBootstrap={false}
//           username={userProfile.name}
//           cursorColor={userProfile.color}
//           cursorsContainerRef={containerRef}
//         />
//         {children}
//     </div>
//   );
// }