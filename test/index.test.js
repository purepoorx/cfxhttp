import { expect, test } from 'vitest'
import index from '../src/index.js'

test('get length', () => {
    function t(o, n) {
        const r = index.get_length(o)
        expect(r).toBe(n)
    }

    t(new Uint8Array([]), 0)
    t(new ArrayBuffer(0), 0)
    t(new ArrayBuffer(), 0)
    t('', 0)
    t(null, 0)
    t(undefined, 0)
    t(void 0, 0)

    t(new Uint8Array([1, 2, 3, 4]), 4)
    t(new ArrayBuffer(3), 3)
    t(1234, 0)
})

test('to size', () => {
    function t(n, s) {
        const r = index.to_size(n)
        expect(r).toBe(s)
    }

    t(2 * 1000 * 1024 * 1024 * 1024 * 1024 * 1024, '2048000 TiB')
    t(2048 * 1024 * 1024 * 1024 * 1024, '2048 TiB')
    t(3 * 1024 * 1024 * 1024 * 1024, '3 TiB')
    t(1 * 1024 * 1024 * 1024 * 1024, '1024 GiB')
    t(1200 * 1024, '1 MiB')
    t(1099 * 1024, '1099 KiB')
    t(0, '0 B')
    t(-1, '-1 B')
    t(-2 * 1000 * 1024 * 1024 * 1024 * 1024 * 1024, '-2048000 TiB')
    t(-2048 * 1024 * 1024 * 1024 * 1024, '-2048 TiB')
    t(-3 * 1024 * 1024 * 1024 * 1024, '-3 TiB')
    t(-1 * 1024 * 1024 * 1024 * 1024, '-1024 GiB')
    t(-1200 * 1024, '-1 MiB')
    t(-1099 * 1024, '-1099 KiB')
    t(-0, '0 B')
})

test('concat typed arrays', () => {
    let a = new Uint8Array([])
    let r = index.concat_typed_arrays(a)
    expect(r.length).toBe(0)

    a = new Uint8Array([1, 2])
    let b = new Uint8Array([3, 4, 5])
    r = index.concat_typed_arrays(a, b)
    expect(r.length).toBe(2 + 3)
    expect(r[1]).toBe(2)
    expect(r[4]).toBe(5)

    let c = new Uint8Array([])
    r = index.concat_typed_arrays(a, c, b)
    expect(r.length).toBe(2 + 3)
    expect(r[1]).toBe(2)
    expect(r[4]).toBe(5)

    c = new Uint8Array([7, 8])
    r = index.concat_typed_arrays(a, c, b)
    expect(r.length).toBe(2 + 2 + 3)
    expect(r[1]).toBe(2)
    expect(r[3]).toBe(8)
    expect(r[4]).toBe(3)
})

test('parse uuid test', () => {
    const uuid = '81c11ae9-28f3-4439-8812-d8dbf0904eae'
    const exps = [
        129, 193, 26, 233, 40, 243, 68, 57, 136, 18, 216, 219, 240, 144, 78,
        174,
    ]
    const r = index.parse_uuid(uuid)
    for (let index = 0; index < 16; index++) {
        const v = r[index]
        const exp = exps[index]
        expect(v).toBe(exp)
    }
})

test('validate uuid test', () => {
    const s = '81c11ae9-28f3-4439-8812-d8dbf0904eae'
    const uuid = index.parse_uuid(s)
    const chunk = [
        129, 193, 26, 233, 40, 243, 68, 57, 136, 18, 216, 219, 240, 144, 78,
        174,
    ]

    let r = index.validate_uuid(chunk, uuid)
    expect(r).toBe(true)
    chunk[1]++
    r = index.validate_uuid(chunk, uuid)
    expect(r).toBe(false)
})
