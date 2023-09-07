import subprocess
import time

# Number of times to run test
num_runs = 10

total_execution_time = 0

for i in range(num_runs):
  start_time = time.time()

  # Run index.js and display output
  # output = subprocess.run(["node", "index.js"])
  
  # Run index.js and hide output
  output = subprocess.run(["node", "index.js"], stdout=subprocess.DEVNULL)
  
  end_time = time.time()
  
  # Execution time for current run
  curr_execution_time = end_time - start_time
  
  # Update total execution time
  total_execution_time += curr_execution_time

# Calculate the average execution time
average_execution_time = total_execution_time / num_runs

print(f'Average execution time over {num_runs} runs: {average_execution_time:.2f} seconds')
