// tests.js
import crypto from 'crypto'
import { promises as fs } from 'fs'

// Функция для тестирования CPU
function cpuIntensiveTask(iterations = 1000000) {
  let result = 0
  for (let i = 0; i < iterations; i++) {
    result += Math.sqrt(i)
  }
  return result
}

// Функция для тестирования памяти
function memoryIntensiveTask(size = 1000000) {
  const arr = new Array(size).fill(0)
  return arr.reduce((sum, current) => sum + current, 0)
}

// Функция для тестирования дисковых операций
async function diskIOTask(fileName = 'test.txt', size = 1024 * 1024 * 10) {
  const data = crypto.randomBytes(size)
  await fs.writeFile(fileName, data)
  const readData = await fs.readFile(fileName)
  await fs.unlink(fileName)
  return readData.length
}

// Функция для тестирования сетевых операций
function networkTask(
  url = 'https://jsonplaceholder.typicode.com/todos',
  iterations = 10
) {
  const fetchUrl = () => {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((data) => {
          return data.json()
        })
        .then((data) => {
          resolve(data.length)
        })
    })
  }

  return Promise.all(
    Array(iterations)
      .fill()
      .map(() => fetchUrl())
  ).then((results) => results.reduce((sum, size) => sum + size, 0))
}

// Функция для запуска всех тестов
export async function runAllTests() {
  const start = process.hrtime()

  const cpuStart = process.hrtime()
  const cpuResult = cpuIntensiveTask()
  const cpuTime = process.hrtime(cpuStart)

  const memoryStart = process.hrtime()
  const memoryResult = memoryIntensiveTask()
  const memoryTime = process.hrtime(memoryStart)

  const diskStart = process.hrtime()
  const diskResult = await diskIOTask()
  const diskTime = process.hrtime(diskStart)

  const networkStart = process.hrtime()
  const networkResult = await networkTask()
  const networkTime = process.hrtime(networkStart)

  const totalTime = process.hrtime(start)

  return {
    cpu: { time: hrtimeToMs(cpuTime), result: cpuResult },
    memory: { time: hrtimeToMs(memoryTime), result: memoryResult },
    disk: { time: hrtimeToMs(diskTime), result: diskResult },
    network: { time: hrtimeToMs(networkTime), result: networkResult },
    total: { time: hrtimeToMs(totalTime) },
  }
}

// Вспомогательная функция для преобразования hrtime в миллисекунды
function hrtimeToMs([seconds, nanoseconds]) {
  return seconds * 1000 + nanoseconds / 1000000
}
