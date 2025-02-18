import React, { useEffect, useState, useRef } from "react";

function TestMessage() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [username, setUsername] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [hasUsername, setHasUsername] = useState(false);

  // 메시지 컨테이너에 대한 ref 추가
  const messageContainerRef = useRef(null);

  // 메시지가 업데이트될 때마다 스크롤을 아래로 이동시키는 useEffect 추가
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    let ws;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    const connectWebSocket = () => {
      ws = new WebSocket("ws://112.222.157.157:5234/chat/3");

      ws.onopen = () => {
        console.log("웹소켓 연결 성공!");
        setConnected(true);
        setSocket(ws);
        reconnectAttempts = 0; // 연결 성공시 재시도 횟수 초기화
      };

      ws.onmessage = event => {
        try {
          const rawData = event.data;
          let messageData;

          // 데이터가 "새 메세지: "로 시작하는 경우
          if (
            typeof rawData === "string" &&
            rawData.startsWith("새 메세지: ")
          ) {
            messageData = rawData.substring(6); // "새 메세지: " 제거 (한글 문자 길이 고려)
          } else {
            messageData = rawData;
          }

          const message = JSON.parse(messageData);
          setMessages(prevMessages => [...prevMessages, message]);
        } catch (error) {
          console.error("메시지 파싱 에러:", error);
          console.log("원본 데이터:", event.data);
          // 일반 텍스트 메시지로 처리
          setMessages(prevMessages => [
            ...prevMessages,
            {
              username: "시스템",
              message: event.data,
            },
          ]);
        }
      };

      ws.onerror = error => {
        console.error("웹소켓 연결 에러:", error);
      };

      ws.onclose = () => {
        console.log("웹소켓 연결 종료");
        setConnected(false);
        setSocket(null);

        // 재연결 시도
        if (reconnectAttempts < maxReconnectAttempts) {
          console.log(`${reconnectAttempts + 1}번째 재연결 시도...`);
          reconnectAttempts++;
          setTimeout(connectWebSocket, 3000); // 3초 후 재연결 시도
        }
      };
    };

    connectWebSocket();

    // 컴포넌트 언마운트 시 연결 종료
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const handleSetUsername = () => {
    if (username.trim()) {
      setHasUsername(true);
    }
  };

  const handleFileChange = e => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSendMessage = async e => {
    e.preventDefault();
    if (socket && socket.readyState === WebSocket.OPEN && username) {
      try {
        // 파일들을 바이너리로 변환
        const filePromises = selectedFiles.map(file => {
          return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = e => {
              resolve({
                name: file.name,
                type: file.type,
                size: file.size,
                data: e.target.result.split(",")[1], // base64 데이터만 추출
              });
            };
            reader.readAsDataURL(file);
          });
        });

        const processedFiles = await Promise.all(filePromises);

        const messageData = {
          flag: 1,
          roomId: 3,
          message: inputMessage,
          // username: username,
          // files: processedFiles,
        };

        // 전송할 데이터를 콘솔에 출력
        console.log("전송할 메시지 데이터:", messageData);
        console.log("전송할 메시지 JSON:", JSON.stringify(messageData));

        socket.send(JSON.stringify(messageData));
        setInputMessage("");
        setSelectedFiles([]);
      } catch (error) {
        console.error("메시지 전송 실패:", error);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-4 font-semibold text-gray-700">
        연결 상태:{" "}
        {connected ? (
          <span className="text-green-600">연결됨</span>
        ) : (
          <span className="text-red-600">연결되지 않음</span>
        )}
      </div>

      {!hasUsername ? (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="사용자 이름"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSetUsername}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            채팅 시작하기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            ref={messageContainerRef}
            className="h-[400px] overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className="mb-2 p-2 rounded-lg bg-white shadow-sm"
              >
                <strong className="text-blue-600">{msg.username}: </strong>
                <span className="text-gray-700">{msg.message}</span>
                {msg.files && msg.files.length > 0 && (
                  <div className="mt-2">
                    {msg.files.map((file, fileIndex) => (
                      <div key={fileIndex} className="text-sm text-gray-500">
                        📎 {file.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder="메시지를 입력하세요"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
              >
                파일
              </label>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                전송
              </button>
            </div>
            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="text-sm bg-gray-100 px-2 py-1 rounded"
                  >
                    📎 {file.name}
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

export default TestMessage;
