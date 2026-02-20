export type PollOptionType = {
  id: string;
  title: string;
  score: number;
};

export interface PollWithOptionsDTO {
  poll: {
    id: string;
    title: string;
    options: PollOptionType[];
  };
}
