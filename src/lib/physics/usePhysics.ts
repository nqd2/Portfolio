import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

export function usePhysics(skills: { name: string }[]) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const skillBodiesRef = useRef<Matter.Body[]>([]);
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const initialPositionsRef = useRef<{x: number, y: number}[]>([]);

  const [isLocked, setIsLocked] = useState(false);
  const isLockedRef = useRef(isLocked);

  useEffect(() => {
    isLockedRef.current = isLocked;
  }, [isLocked]);

  useEffect(() => {
    if (!containerRef.current) return;

    const Engine = Matter.Engine,
      Runner = Matter.Runner,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Body = Matter.Body;

    const engine = Engine.create({
      enableSleeping: true, 
      positionIterations: 8,
      velocityIterations: 6,
      constraintIterations: 4,
    });
    engineRef.current = engine;
    
    engine.gravity.y = 1;
    engine.gravity.scale = 0.001;

    const updateDimensions = () => {
      if (!containerRef.current) return { width: 300, height: 300 };
      return {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight || 300
      };
    };

    const initialDims = updateDimensions();
    const width = initialDims.width;
    const height = initialDims.height;
    const thickness = 60;
    
    const floor = Bodies.rectangle(width / 2, height + thickness / 2, width + 200, thickness, { isStatic: true });
    const leftWall = Bodies.rectangle(-thickness / 2, height / 2, thickness, height * 2, { isStatic: true });
    const rightWall = Bodies.rectangle(width + thickness / 2, height / 2, thickness, height * 2, { isStatic: true });
    const ceiling = Bodies.rectangle(width / 2, -100, width + 200, thickness, { isStatic: true });

    World.add(engine.world, [floor, leftWall, rightWall, ceiling]);

    const calculateInitialPositions = (containerWidth: number, containerHeight: number) => {
      const positions: { x: number; y: number }[] = [];
      let cx = 20;
      let cy = 30;

      skills.forEach((skill, index) => {
        const el = elementsRef.current[index];
        let bodyWidth = 100;
        if (el && el.offsetWidth > 0) {
          bodyWidth = el.offsetWidth;
        } else {
          bodyWidth = skill.name.length * 10 + 60;
        }
        
        const bodyHeight = 44;

        if (cx + bodyWidth > containerWidth - 20) {
          cx = 20;
          cy += bodyHeight + 8;
        }

        let bodyY = cy;
        if (bodyY > containerHeight - bodyHeight) {
          bodyY = containerHeight - bodyHeight - Math.random() * 10;
        }

        positions.push({ x: cx + bodyWidth / 2, y: bodyY });
        cx += bodyWidth + 8;
      });
      return positions;
    };

    const initialPos = calculateInitialPositions(width, height);
    initialPositionsRef.current = initialPos;

    const newSkillBodies: Matter.Body[] = [];
    skills.forEach((skill, index) => {
      const el = elementsRef.current[index];
      let bodyWidth = 100;
      if (el && el.offsetWidth > 0) {
        bodyWidth = el.offsetWidth;
      } else {
        bodyWidth = skill.name.length * 10 + 60;
      }
      
      const pos = initialPos[index];
      const categoryDensity = 0.003;

      const body = Bodies.rectangle(pos.x, pos.y, bodyWidth, 44, {
        restitution: 0.15, 
        friction: 0.1,
        frictionAir: 0.015, 
        density: categoryDensity,
        chamfer: { radius: 4 } 
      });
      newSkillBodies.push(body);
      World.add(engine.world, body);
    });
    
    skillBodiesRef.current = newSkillBodies;

    const mouse = Matter.Mouse.create(containerRef.current);
    const mEngine = engine as Matter.Engine & { mouse: Matter.Mouse };
    mEngine.mouse = mouse;
    const mMouse = mouse as unknown as Record<string, EventListener>;
    mouse.element.removeEventListener("mousewheel", mMouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mMouse.mousewheel);
    
    let activeConstraint: Matter.Constraint | null = null;
    let dragBody: Matter.Body | null = null;
    
    Matter.Events.on(engine, 'beforeUpdate', () => {
      if (activeConstraint && dragBody) {
        activeConstraint.pointB = { x: mouse.position.x, y: mouse.position.y };
      }
    });

    const handleMouseDown = () => {
      const bodiesToCheck = skillBodiesRef.current;
      const clickedBodies = Matter.Query.point(bodiesToCheck, mouse.position);
      
      if (clickedBodies.length > 0) {
        dragBody = clickedBodies[0];
        Matter.Sleeping.set(dragBody, false);
        
        if (isLockedRef.current) {
          Matter.Body.set(dragBody, "frictionAir", 0.005);
        }

        const offset = {
          x: mouse.position.x - dragBody.position.x,
          y: mouse.position.y - dragBody.position.y
        };

        activeConstraint = Matter.Constraint.create({
          bodyA: dragBody,
          pointA: offset,
          pointB: mouse.position,
          stiffness: 0.1, 
          damping: 0.15,
          length: 0,
          render: { visible: false }
        });

        World.add(engine.world, activeConstraint);
      }
    };

    const handleMouseUp = () => {
      if (activeConstraint && dragBody) {
        World.remove(engine.world, activeConstraint);
        activeConstraint = null;

        const releasedBody = dragBody; 
        dragBody = null;

        if (isLockedRef.current) {
           setTimeout(() => {
             if (releasedBody) Matter.Body.set(releasedBody, "frictionAir", 0.2);
           }, 50); 
        } else {
           if (releasedBody) Matter.Body.set(releasedBody, "frictionAir", 0.015);
        }
      }
    };

    const element = containerRef.current;
    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("mouseup", handleMouseUp);
    element.addEventListener("mouseleave", handleMouseUp);
    
    element.addEventListener("touchstart", handleMouseDown, { passive: false });
    element.addEventListener("touchend", handleMouseUp);
    element.addEventListener("touchcancel", handleMouseUp);

    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    const updateDOM = () => {
      newSkillBodies.forEach((body, i) => {
        const el = elementsRef.current[i];
        if (el) {
          const x = body.position.x - el.offsetWidth / 2;
          const y = body.position.y - el.offsetHeight / 2;
          el.style.transform = `translate(${x}px, ${y}px) rotate(${body.angle}rad)`;
        }
      });
      animationFrameId = requestAnimationFrame(updateDOM);
    };
    
    let animationFrameId = requestAnimationFrame(updateDOM);

    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      Body.setPosition(rightWall, { x: newWidth + thickness / 2, y: newHeight / 2 });
      Body.setPosition(floor, { x: newWidth / 2, y: newHeight + thickness / 2 });
      Body.setPosition(ceiling, { x: newWidth / 2, y: -100 });
      
      Matter.Body.setVertices(floor, Matter.Bodies.rectangle(newWidth / 2, newHeight + thickness / 2, newWidth + 200, thickness).vertices);
      Matter.Body.setVertices(ceiling, Matter.Bodies.rectangle(newWidth / 2, -100, newWidth + 200, thickness).vertices);

      initialPositionsRef.current = calculateInitialPositions(newWidth, newHeight);
    };
    
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      
      if (activeConstraint) {
        World.remove(engine.world, activeConstraint);
      }
      element.removeEventListener("mousedown", handleMouseDown);
      element.removeEventListener("mouseup", handleMouseUp);
      element.removeEventListener("mouseleave", handleMouseUp);
      element.removeEventListener("touchstart", handleMouseDown);
      element.removeEventListener("touchend", handleMouseUp);
      element.removeEventListener("touchcancel", handleMouseUp);
      Matter.Events.off(engine, 'beforeUpdate');

      World.clear(engine.world, false);
      Engine.clear(engine);
      if (runnerRef.current) Runner.stop(runnerRef.current);
    };
  }, [skills]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    
    const handleScroll = () => {
      if (isLocked) return;
      const currentScrollY = window.scrollY;
      const currentTime = performance.now();
      
      const deltaY = currentScrollY - lastScrollY;
      const deltaTime = currentTime - lastTime;
      
      lastScrollY = currentScrollY;
      lastTime = currentTime;

      if (deltaTime > 0 && Math.abs(deltaY) > 2) {
        let velocity = deltaY / deltaTime;
        velocity = Math.max(-40, Math.min(40, velocity));
        
        const forceMagnitude = velocity * 0.00005; 
        
        skillBodiesRef.current.forEach(body => {
          Matter.Sleeping.set(body, false);
          Matter.Body.applyForce(body, body.position, { 
            x: (Math.random() - 0.5) * 0.002, 
            y: forceMagnitude 
          });
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLocked]);

  const handleLockToggle = () => {
    const newLockState = !isLocked;
    setIsLocked(newLockState);
    if (engineRef.current) {
      if (newLockState) {
        engineRef.current.gravity.y = 0;
        skillBodiesRef.current.forEach(body => {
          Matter.Body.set(body, "frictionAir", 0.2); 
          Matter.Body.setVelocity(body, { x: 0, y: 0 });
          Matter.Body.setAngularVelocity(body, 0);
          if (body.speed < 0.1) {
            Matter.Sleeping.set(body, true);
          }
        });
      } else {
        engineRef.current.gravity.y = 1;
        skillBodiesRef.current.forEach(body => {
          Matter.Body.set(body, "frictionAir", 0.015);
          Matter.Sleeping.set(body, false);
        });
      }
    }
  };

  const handleReset = () => {
    if (engineRef.current && containerRef.current) {
      if (isLocked) engineRef.current.gravity.y = 0;
      
      skillBodiesRef.current.forEach((body, index) => {
        Matter.Body.setPosition(body, {
          x: initialPositionsRef.current[index].x,
          y: initialPositionsRef.current[index].y
        });
        Matter.Body.setVelocity(body, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(body, 0);
        Matter.Body.setAngle(body, 0);
        
        if (isLocked) {
          Matter.Sleeping.set(body, true);
        } else {
          Matter.Sleeping.set(body, false);
          (body as Matter.Body & { sleepCounter: number }).sleepCounter = 0; 
          Matter.Body.applyForce(body, body.position, { x: 0, y: 0.000001 });
        }
      });
    }
  };

  return { containerRef, elementsRef, isLocked, handleLockToggle, handleReset };
}
