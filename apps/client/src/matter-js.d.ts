declare module 'matter-js' {
  export interface Vector {
    x: number;
    y: number;
  }

  export interface Body {
    position: Vector;
    velocity: Vector;
    label: string;
  }

  export interface World {
    gravity: { x: number; y: number };
  }

  export interface Engine {
    world: World;
  }

  export interface Runner {
    enabled: boolean;
  }

  export const Engine: {
    create: () => Engine;
    clear: (engine: Engine) => void;
  };

  export const World: {
    add: (world: World, body: Body | Body[]) => void;
  };

  export const Bodies: {
    circle: (x: number, y: number, radius: number, options?: Record<string, unknown>) => Body;
  };

  export const Runner: {
    create: () => Runner;
    run: (runner: Runner, engine: Engine) => void;
    stop: (runner: Runner) => void;
  };

  export const Events: {
    on: (obj: unknown, eventName: string, callback: (...args: unknown[]) => void) => void;
  };
}
