export type Result = Record<
  string,
  {
    pos: number;
    page: number;
  }
>;

export type SaveResult = Record<
  string,
  Record<
    string,
    {
      pos: number;
      page: number;
      date: string;
    }
  >
>;

export type Params = {
  queries: string[];
  skus: number[];
};
