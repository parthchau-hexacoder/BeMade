function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function wait() {
  console.log("Start");
  await sleep(1500);
  console.log("End");
}
