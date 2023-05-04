export type MessageTypes = 'result' | 'empty';

export type Result = {
  component: string;
  imports: string;
};

type ResultData = {
  pluginMessage: {
    type: MessageTypes;
    component: string;
    imports: string;
  };
};

export type Message = MessageEvent<ResultData>;
