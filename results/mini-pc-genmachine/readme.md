# Sysbench

## sysbench 1 CPU

```sh
sysbench cpu --cpu-max-prime=20000 --threads=1 run
```

```
sysbench 1.0.20 (using system LuaJIT 2.1.0-beta3)

Running the test with following options:
Number of threads: 1
Initializing random number generator from current time


Prime numbers limit: 20000

Initializing worker threads...

Threads started!

CPU speed:
    events per second:  2017.55

General statistics:
    total time:                          10.0005s
    total number of events:              20178

Latency (ms):
         min:                                    0.49
         avg:                                    0.50
         max:                                    0.96
         95th percentile:                        0.50
         sum:                                 9998.29

Threads fairness:
    events (avg/stddev):           20178.0000/0.00
    execution time (avg/stddev):   9.9983/0.00
```

## sysbench 4 CPU

```sh
sysbench cpu --cpu-max-prime=20000 --threads=4 run
```

```
sysbench 1.0.20 (using system LuaJIT 2.1.0-beta3)

Running the test with following options:
Number of threads: 4
Initializing random number generator from current time


Prime numbers limit: 20000

Initializing worker threads...

Threads started!

CPU speed:
    events per second:  7925.16

General statistics:
    total time:                          10.0005s
    total number of events:              79259

Latency (ms):
         min:                                    0.49
         avg:                                    0.50
         max:                                    0.92
         95th percentile:                        0.51
         sum:                                39992.78

Threads fairness:
    events (avg/stddev):           19814.7500/15.48
    execution time (avg/stddev):   9.9982/0.00
```

## Memory test

```sh
sysbench memory --memory-block-size=1K --memory-total-size=10G run
```

```
sysbench 1.0.20 (using system LuaJIT 2.1.0-beta3)

Running the test with following options:
Number of threads: 1
Initializing random number generator from current time


Running memory speed test with the following options:
  block size: 1KiB
  total size: 10240MiB
  operation: write
  scope: global

Initializing worker threads...

Threads started!

Total operations: 10485760 (7879307.89 per second)

10240.00 MiB transferred (7694.64 MiB/sec)


General statistics:
    total time:                          1.3300s
    total number of events:              10485760

Latency (ms):
         min:                                    0.00
         avg:                                    0.00
         max:                                    0.03
         95th percentile:                        0.00
         sum:                                  558.30

Threads fairness:
    events (avg/stddev):           10485760.0000/0.00
    execution time (avg/stddev):   0.5583/0.00
```

## File IO

Подготовка

```sh
sysbench fileio --file-total-size=3G prepare
```

```
sysbench 1.0.20 (using system LuaJIT 2.1.0-beta3)

128 files, 24576Kb each, 3072Mb total
Creating files for the test...
Extra file open flags: (none)
Creating file test_file.0
Creating file test_file.1
...
Creating file test_file.127
3221225472 bytes written in 3.72 seconds (825.98 MiB/sec).
```

Тест

```sh
sysbench fileio --file-total-size=3G --file-test-mode=rndrw --time=120 --max-requests=0 run
```

```
sysbench 1.0.20 (using system LuaJIT 2.1.0-beta3)

Running the test with following options:
Number of threads: 1
Initializing random number generator from current time


Extra file open flags: (none)
128 files, 24MiB each
3GiB total file size
Block size 16KiB
Number of IO requests: 0
Read/Write ratio for combined random IO test: 1.50
Periodic FSYNC enabled, calling fsync() each 100 requests.
Calling fsync() at the end of test, Enabled.
Using synchronous I/O mode
Doing random r/w test
Initializing worker threads...

Threads started!


File operations:
    reads/s:                      4721.81
    writes/s:                     3147.87
    fsyncs/s:                     10074.02

Throughput:
    read, MiB/s:                  73.78
    written, MiB/s:               49.19

General statistics:
    total time:                          120.0042s
    total number of events:              2153203

Latency (ms):
         min:                                    0.00
         avg:                                    0.06
         max:                                  158.35
         95th percentile:                        0.28
         sum:                               119579.15

Threads fairness:
    events (avg/stddev):           2153203.0000/0.00
    execution time (avg/stddev):   119.5792/0.00
```

# PostgreSQL

```sh
pgbench -i -s 50 testing
```

```
dropping old tables...
NOTICE:  table "pgbench_accounts" does not exist, skipping
NOTICE:  table "pgbench_branches" does not exist, skipping
NOTICE:  table "pgbench_history" does not exist, skipping
NOTICE:  table "pgbench_tellers" does not exist, skipping
creating tables...
generating data (client-side)...
5000000 of 5000000 tuples (100%) done (elapsed 3.23 s, remaining 0.00 s)
vacuuming...
creating primary keys...
done in 4.46 s (drop tables 0.00 s, create tables 0.00 s, client-side generate 3.25 s, vacuum 0.10 s, primary keys 1.11 s).
```

```sh
pgbench -c 10 -j 2 -T 60 testing
```

```
pgbench (16.9)
starting vacuum...end.
transaction type: <builtin: TPC-B (sort of)>
scaling factor: 50
query mode: simple
number of clients: 10
number of threads: 2
maximum number of tries: 1
duration: 60 s
number of transactions actually processed: 567041
number of failed transactions: 0 (0.000%)
latency average = 1.058 ms
initial connection time = 8.234 ms
tps = 9451.287428 (without initial connection time)
```
