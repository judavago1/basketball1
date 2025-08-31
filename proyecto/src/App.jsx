import React, { useRef, useState, useEffect } from "react";

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

export default function App() {
  const [score, setScore] = useState(0);
  const [ballPos, setBallPos] = useState({
    x: SCREEN_WIDTH / 2 - 40,
    y: SCREEN_HEIGHT - 150,
  });

  const velocity = useRef({ x: 0, y: 0 });
  const isMoving = useRef(false);
  const frameCount = useRef(0);
  const startTouch = useRef({ x: 0, y: 0 });

  const gravity = 0.7;
  const maxFrames = 300;

  // Canasta fija
  const hoop = {
    x: SCREEN_WIDTH / 2.15 - 50,
    y: 150,
    width: 100,
    height: 60,
  };

  // Manejo de mouse/touch
  const handleMouseDown = (e) => {
    if (isMoving.current) return;
    startTouch.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e) => {
    if (isMoving.current) return;
    const dx = e.clientX - startTouch.current.x;
    const dy = e.clientY - startTouch.current.y;

    velocity.current = { x: dx * 0.2, y: dy * 0.2 };
    isMoving.current = true;
    frameCount.current = 0;
    animate();
  };

  // Animación
  const animate = () => {
    if (!isMoving.current) return;

    frameCount.current++;

    setBallPos((prev) => ({
      x: prev.x + velocity.current.x,
      y: prev.y + velocity.current.y,
    }));

    velocity.current = {
      x: velocity.current.x,
      y: velocity.current.y + gravity,
    };

    // Verificar colisión
    if (checkCollision()) {
      setScore((prev) => prev + 1);
      resetBall(false);
      return;
    }

    // Fuera de límites
    if (
      ballPos.y > SCREEN_HEIGHT ||
      ballPos.x < -100 ||
      ballPos.x > SCREEN_WIDTH + 100 ||
      frameCount.current > maxFrames
    ) {
      resetBall(false);
      return;
    }

    requestAnimationFrame(animate);
  };

  const checkCollision = () => {
    const ballX = ballPos.x;
    const ballY = ballPos.y;
    const ballRadius = 40;

    return (
      ballX + ballRadius > hoop.x &&
      ballX - ballRadius < hoop.x + hoop.width &&
      ballY + ballRadius > hoop.y &&
      ballY - ballRadius < hoop.y + hoop.height
    );
  };

  const resetBall = (resetScore = true) => {
    isMoving.current = false;
    setBallPos({ x: SCREEN_WIDTH / 2 - 40, y: SCREEN_HEIGHT - 150 });
    velocity.current = { x: 0, y: 0 };
    if (resetScore) setScore(0);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundImage:
          "url('https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Basketball_Court_FIBA.svg/2560px-Basketball_Court_FIBA.svg.png')",
        backgroundSize: "cover",
        position: "relative",
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "35px",
          color: "white",
          textShadow: "1px 1px 4px black",
          marginTop: "60px",
        }}
      >
        🏀 Puntos: {score}
      </h1>

      {/* Canasta */}
      <div
        style={{
          position: "absolute",
          left: hoop.x,
          top: hoop.y,
          width: hoop.width + 25,
          height: hoop.height + 20,
          border: "5px solid orange",
          borderBottom: "0",
          borderBottomLeftRadius: "60px",
          borderBottomRightRadius: "60px",
          backgroundColor: "rgba(255,165,0,0.1)",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "30px",
            borderBottomLeftRadius: "60px",
            borderBottomRightRadius: "60px",
            backgroundColor: "rgba(255,255,255,0.7)",
          }}
        />
      </div>

      {/* Pelota */}
      <div
        style={{
          position: "absolute",
          left: ballPos.x,
          top: ballPos.y,
          width: "87px",
          height: "87px",
          backgroundColor: "orange",
          border: "4px solid brown",
          borderRadius: "50%",
          boxShadow: "0 6px 10px rgba(0,0,0,0.4)",
        }}
      />

      {/* Botón */}
      <button
        onClick={() => resetBall(true)}
        style={{
          position: "absolute",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-75px)",
          width: "150px",
          padding: "14px",
          backgroundColor: "#ff5722",
          borderRadius: "8px",
          border: "none",
          color: "white",
          fontSize: "16px",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
        }}
      >
        🔄 Volver a Intentar
      </button>
    </div>
  );
}
