import "./MainLiveComponent.less";
import liveBtn from "@/assets/images/smallIcons/LiveBtn.svg";
import redLiveBtn from "@/assets/images/smallIcons/redLiveBtn.svg";

import playIcon from "@/assets/images/smallIcons/play.svg";
import pauseIcon from "@/assets/images/smallIcons/pause.svg";
import { io } from "socket.io-client";
const mediasoupClient = require("mediasoup-client");

import { useEffect, useRef, useState } from "react";
import { endLive, startLive, addMember } from "@/assets/Api";
import { history } from "umi";

let socket: any;
let device: any;
let videoProducerTransport: any;
let audioProducerTransport: any;
let rtpCapabilities: any;
let session_id: any;
let consumer_id: any;
let audio_track: any;
let video_track: any;
let audio_producer: any;
let video_producer: any;
let videoConsumerTransport: any;
let audioConsumerTransport: any;
let video_consumer;
let audio_consumer;

const MainLiveComponent = (props: {
  rtpCapabilities?: any;
  roomId: string;
  viewer?: boolean;
}) => {
  const { roomId, viewer } = props;
  const wetooStreamRef = useRef<any>(null);

  const [waiting, setWaiting] = useState(true);
  const [liveStarted, setLiveStarted] = useState(false);
  const [watching, setWatching] = useState(false);

  useEffect(() => {
    startSocket();
  }, []);

  useEffect(() => {
    return () => {
      // if (roomId && !viewer)
      //   endLive(roomId).then((res) => {
      //     socket.emit("end", { room_id: roomId });
      //     history.push("/insight-web");
      //   });
    };
  }, []);

  const startSocket = () => {
    socket = io("wss://live.me2we2.com/mediasoup", {
      rejectUnauthorized: false,
    });

    socket.on("connect_error", (error: any) => {
      console.log("*** error", error);
    });

    // socket.on("connect", async () => {
    //   if (props.viewer) {
    //     console.log('Consumer page -------- () >>>>')
    //     await getRtpCapability(roomId);
    //     // await createDevice(rtpCapabilities);
    //     // await createRecvTransport();
    //     // await connectRecvTransport();
    //   }
    //   else{
    //     console.log('Producer page --------- () <<<<<<<<')
    //     await getLocalStream();
    //   }
    // });

    socket.on("connection-success", async ({ socketId }: any) => {
      console.log(socketId);
      session_id = socketId;
      if (props.viewer) {
        console.log("Consumer page -------- () >>>>");
        await getRtpCapability(roomId);
        // await createDevice(rtpCapabilities);
        // await createRecvTransport();
        // await connectRecvTransport();
      } else {
        console.log("Producer page --------- () <<<<<<<<");
        await getLocalStream();
      }
    });
  };

  const createRecvTransport = async () => {
    console.log("(7). Start creating consumer with this room id: ", roomId);
    await socket.emit(
      "createRecvTransport",
      { room_id: roomId },
      (params: any) => {
        console.log(params);
        let videoParam: any = {};
        let audioParam: any = {};

        // seperating two different params
        for (const key in params) {
          if (key.startsWith("video_")) {
            videoParam[key.replace("video_", "")] = params[key];
          } else if (key.startsWith("audio_")) {
            audioParam[key.replace("audio_", "")] = params[key];
          }
        }
        console.log("(Recv creation) Video params: ", videoParam);
        console.log("(Recv creation) Audio params: ", audioParam);

        // create the recv transport
        videoConsumerTransport = device.createRecvTransport(videoParam);
        audioConsumerTransport = device.createRecvTransport(audioParam);

        videoConsumerTransport.on(
          "connect",
          async ({ dtlsParameters }: any, callback: any, errback: any) => {
            try {
              // Signal local DTLS parameters to the server side transport
              await socket.emit("transport-recv-connect", {
                // transportId: consumerTransport.id,
                room_id: roomId,
                dtlsParameters: dtlsParameters,
                kind: "video",
              });
              console.log("It was OK (creating video consumer)");
              // Tell the transport that parameters were transmitted.
              callback();
            } catch (error) {
              // Tell the transport that something was wrong
              errback(error);
            }
          }
        );

        audioConsumerTransport.on(
          "connect",
          async ({ dtlsParameters }: any, callback: any, errback: any) => {
            try {
              // Signal local DTLS parameters to the server side transport
              await socket.emit("transport-recv-connect", {
                // transportId: consumerTransport.id,
                room_id: roomId,
                dtlsParameters: dtlsParameters,
                kind: "audio",
              });
              console.log("It was OK (creating audio consumer)");
              // Tell the transport that parameters were transmitted.
              callback();
            } catch (error) {
              // Tell the transport that something was wrong
              errback(error);
            }
          }
        );
        connectRecvTransport();
      }
    );
    console.log("Done with consumer creation");
  };

  const connectRecvTransport = async () => {
    console.log("Start consuming: ", consumer_id);
    await socket.emit(
      "consume",
      {
        room_id: roomId,
        rtpCapabilities: device?.rtpCapabilities,
      },
      async ({ params }: any) => {
        if (params.error) {
          console.log(params.error);
          console.log("Cannot Consume");
          return;
        }
        console.log("Yes it can consume");

        console.log(params);
        let videoParam: any = {};
        let audioParam: any = {};

        // seperating two different params
        for (const key in params) {
          if (key.startsWith("video_")) {
            videoParam[key.replace("video_", "")] = params[key];
          } else if (key.startsWith("audio_")) {
            audioParam[key.replace("audio_", "")] = params[key];
          }
        }
        console.log("(Consuming) Video params: ", videoParam);
        console.log("(Consuming) Audio params: ", audioParam);

        video_consumer = await videoConsumerTransport.consume({
          id: videoParam.id,
          producerId: videoParam.producerId,
          kind: videoParam.kind,
          rtpParameters: videoParam.rtpParameters,
        });

        audio_consumer = await audioConsumerTransport.consume({
          id: audioParam.id,
          producerId: audioParam.producerId,
          kind: audioParam.kind,
          rtpParameters: audioParam.rtpParameters,
        });

        const stream = new MediaStream();
        stream.addTrack(video_consumer.track);
        stream.addTrack(audio_consumer.track);
        wetooStreamRef.current.srcObject = stream;
        addMember(roomId).then((res) => {
          console.log("Add new member");
        });
        socket.emit("consumer-resume", { room_id: roomId });
      }
    );
  };

  const getLocalStream = async () => {
    try {
      console.log("(1). Openning media");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      console.log("Media opened");
      wetooStreamRef.current.srcObject = stream;
      video_track = stream.getVideoTracks()[0];
      audio_track = stream.getAudioTracks()[0];

      // Perform other operations with the stream or customParams
      console.log("(2). Calling live room creation");
      createLiveRoom();
      // createDevice();
    } catch (err) {
      console.error("Error accessing media devices:", err);
      // Handle the error
    }
  };

  const createLiveRoom = async () => {
    console.log("(3). Rooms ID is: ", roomId);
    socket.emit(
      "createRoom",
      { room_id: roomId, session_id: session_id },
      (params: any) => {
        console.log("Recieved param from creating room is: ", params);
        rtpCapabilities = params?.rtpCapability;
        console.log("(4). Received RTP is: ", rtpCapabilities);
        createDevice(rtpCapabilities);
      }
    );
    // console.log('Created live room...')
    // console.log('End of it... yahhhh')
  };

  const getRtpCapability = async (room_id: string) => {
    console.log("(1). Getting rtp cap of this room: ", roomId);
    socket.emit("getRtpCapabilities", { room_id: room_id }, (data: any) => {
      console.log("(2). Room RTP Capabilities: ", data?.rtpCapabilities);
      rtpCapabilities = data?.rtpCapabilities;
      console.log("(3-4). Creating device function gets called");
      createDevice(data?.rtpCapabilities);
    });
  };

  const createDevice = async (rtpCapabilities: any) => {
    console.log("(5). Creating device with this rtp...", rtpCapabilities);
    try {
      device = new mediasoupClient.Device();
      await device.load({
        routerRtpCapabilities: rtpCapabilities,
      });
      console.log("(6). Device RTP Capabilities", device?.rtpCapabilities);
      if (!props.viewer) {
        createSendTransport();
      } else {
        createRecvTransport();
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const createSendTransport = async () => {
    console.log("(7). Creation of send transport started");
    socket.emit("createSendTransport", { room_id: roomId }, (params: any) => {
      setWaiting(false);
      console.log(params);
      let videoParam: any = {};
      let audioParam: any = {};

      // seperating two different params
      for (const key in params) {
        if (key.startsWith("video_")) {
          videoParam[key.replace("video_", "")] = params[key];
        } else if (key.startsWith("audio_")) {
          audioParam[key.replace("audio_", "")] = params[key];
        }
      }
      console.log("(Send creation) Video params: ", videoParam);
      console.log("(Send creation) Audio params: ", audioParam);

      videoProducerTransport = device.createSendTransport(videoParam);
      audioProducerTransport = device.createSendTransport(audioParam);

      videoProducerTransport.on(
        "connect",
        async ({ dtlsParameters }: any, callback: any, errback: any) => {
          console.log("videoProducerTransport: Connect event called");

          try {
            // Signal local DTLS parameters to the server side transport
            await socket.emit("transport-connect", {
              // transportId: producerTransport.id,
              room_id: roomId,
              dtlsParameters: dtlsParameters,
              kind: "video",
            });

            // Tell the transport that parameters were transmitted.
            callback();
          } catch (error) {
            errback(error);
          }
        }
      );

      audioProducerTransport.on(
        "connect",
        async ({ dtlsParameters }: any, callback: any, errback: any) => {
          console.log("audioProducerTransport: Connect event called");
          try {
            // Signal local DTLS parameters to the server side transport
            await socket.emit("transport-connect", {
              // transportId: producerTransport.id,
              room_id: roomId,
              dtlsParameters: dtlsParameters,
              kind: "audio",
            });

            // Tell the transport that parameters were transmitted.
            callback();
          } catch (error) {
            errback(error);
          }
        }
      );

      videoProducerTransport.on(
        "produce",
        async (parameters: any, callback: any, errback: any) => {
          console.log("videoProducerTransport: produce event called");
          console.log(parameters);

          try {
            await socket.emit(
              "transport-produce",
              {
                // transportId: producerTransport.id,
                room_id: roomId,
                kind: parameters.kind,
                rtpParameters: parameters.rtpParameters,
              },
              ({ id }: any) => {
                // Tell the transport that parameters were transmitted and provide it with the
                // server side producer's id.
                console.log("Producer id:", id);
                console.log("Done with producer creation");
                callback({ id });
              }
            );
          } catch (error) {
            errback(error);
          }
        }
      );

      audioProducerTransport.on(
        "produce",
        async (parameters: any, callback: any, errback: any) => {
          console.log("audioProducerTransport: produce event called");
          console.log(parameters);

          try {
            await socket.emit(
              "transport-produce",
              {
                // transportId: producerTransport.id,
                room_id: roomId,
                kind: parameters.kind,
                rtpParameters: parameters.rtpParameters,
              },
              ({ id }: any) => {
                // Tell the transport that parameters were transmitted and provide it with the
                // server side producer's id.
                console.log("Producer id:", id);
                console.log("Done with producer creation");
                callback({ id });
              }
            );
          } catch (error) {
            errback(error);
          }
        }
      );
    });
  };

  const connectSendTransport = async () => {
    console.log("Beginning of the second function");
    if (!waiting && !liveStarted) {
      console.log("Starting live");
      setLiveStarted(true);
      audio_producer = await audioProducerTransport.produce({
        track: audio_track,
      });
      video_producer = await videoProducerTransport.produce({
        track: video_track,
        encodings: [
          { maxBitrate: 100000 },
          { maxBitrate: 300000 },
          { maxBitrate: 900000 },
        ],
        codecOptions: {
          videoGoogleStartBitrate: 1000,
        },
      });

      audio_producer.on("trackended", () => {
        console.log("audio track ended");
      });

      video_producer.on("trackended", () => {
        console.log("video track ended");
      });

      audio_producer.on("transportclose", () => {
        console.log("audio transport ended");
      });

      video_producer.on("transportclose", () => {
        console.log("video transport ended");
      });

      startLive(roomId).then((res) => {
        console.log("Change live status");
      });
    } else {
      console.log("Terminating live...");
      // make http request to django as a notifier for ending live
      endLive(roomId).then((res) => {
        socket.emit("end", { room_id: roomId });
        history.push("/insight-web");
      });

      audio_producer.close();
      video_producer.close();

      setLiveStarted(false);
    }
  };

  const startWatchLive = () => {
    //TODO: start watching live
    setWatching((pre) => !pre);
  };

  return (
    <div className="weTooNowTabLive">
      <div
        className={`weTooNowTabLive__container ${
          props.viewer && "weTooNowTabLive__container--watch"
        }`}
      >
        <video
          autoPlay
          className="weTooNowTabLive__video"
          ref={wetooStreamRef}
        />

        <img
          className={`${
            waiting && !props.viewer && "weTooNowTabLive__disableBtn"
          }`}
          src={
            props.viewer
              ? watching
                ? pauseIcon
                : playIcon
              : liveStarted
              ? redLiveBtn
              : liveBtn
          }
          onClick={props.viewer ? startWatchLive : connectSendTransport}
        />
      </div>
    </div>
  );
};

export default MainLiveComponent;
