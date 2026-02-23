
function solution(n){return n<=1?1:n*solution(n-1)}

if (typeof solution !== "function") {
  console.log("ERROR: solution function not found");
  process.exit(1);
}

const tests = [{"input":"1","output":"1","hidden":false,"_id":"699946d6aec0c74d2a8c59e3"},{"input":"2","output":"2","hidden":false,"_id":"699946d6aec0c74d2a8c59e4"},{"input":"5","output":"120","hidden":false,"_id":"699946d6aec0c74d2a8c59e5"},{"input":"7","output":"5040","hidden":false,"_id":"699946d6aec0c74d2a8c59e6"},{"input":"10","output":"3628800","hidden":false,"_id":"699946d6aec0c74d2a8c59e7"},{"input":"3","output":"6","hidden":false,"_id":"69994f26c99928450726f8d9"}];

tests.forEach(t => {
  try {
    const result = solution(t.input);
    console.log(result);
  } catch (err) {
    console.log("ERROR");
  }
});
