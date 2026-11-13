// Cliente RCON mínimo (protocolo Source RCON, el que usa ARK).
import net from 'node:net'

const AUTH = 3, EXEC = 2

function packet(id, type, body) {
  const b = Buffer.from(body, 'utf8')
  const buf = Buffer.alloc(14 + b.length)
  buf.writeInt32LE(10 + b.length, 0)
  buf.writeInt32LE(id, 4)
  buf.writeInt32LE(type, 8)
  b.copy(buf, 12)
  return buf // los 2 bytes finales ya son 0
}

/** Ejecuta un comando y devuelve la respuesta en texto. */
export function rcon(command, { host, port, password, timeout = 8000 }) {
  return new Promise((resolve, reject) => {
    const sock = net.createConnection({ host, port: Number(port) })
    let data = Buffer.alloc(0), authed = false, done = false
    const finish = (err, res) => { if (done) return; done = true; sock.destroy(); err ? reject(err) : resolve(res) }
    sock.setTimeout(timeout, () => finish(new Error('RCON timeout')))
    sock.on('error', finish)
    sock.on('connect', () => sock.write(packet(1, AUTH, password)))
    sock.on('data', chunk => {
      data = Buffer.concat([data, chunk])
      while (data.length >= 4) {
        const size = data.readInt32LE(0)
        if (data.length < size + 4) break
        const id = data.readInt32LE(4), type = data.readInt32LE(8)
        const body = data.toString('utf8', 12, size + 2)
        data = data.subarray(size + 4)
        if (!authed && type === 2) {
          if (id === -1) return finish(new Error('RCON: contraseña incorrecta'))
          authed = true
          sock.write(packet(2, EXEC, command))
        } else if (authed && id === 2) {
          return finish(null, body.trim())
        }
      }
    })
  })
}
