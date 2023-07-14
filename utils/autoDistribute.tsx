// Auto distribute a number of total number to a given number of users
export const AutoDistributeAsInt = (total: number, users: number) => {
  const result = [];
  const base = Math.floor(total / users);
  const remainder = total % users;

  for (let i = 0; i < users; i++) {
    result.push(base + (i < remainder ? 1 : 0));
  }

  return result.reverse();
};
