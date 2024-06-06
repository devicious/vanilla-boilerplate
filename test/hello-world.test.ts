import { describe, expect, it } from 'vitest';
// @ts-ignore
import Example from '@/components/example/example';

describe('Hello World init', () => {
    it('should return true', () => {
        expect(Example()).toStrictEqual(true);
    });
});
