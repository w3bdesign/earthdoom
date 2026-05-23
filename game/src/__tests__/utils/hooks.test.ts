import { useMultipleRefs } from '../../utils/hooks';

describe('useMultipleRefs', () => {
  it('returns an array of the specified length', () => {
    const refs = useMultipleRefs(5);
    expect(refs).toHaveLength(5);
  });

  it('returns an empty array when length is 0', () => {
    const refs = useMultipleRefs(0);
    expect(refs).toHaveLength(0);
  });

  it('returns refs with current value of null initially', () => {
    const refs = useMultipleRefs(3);
    refs.forEach((ref) => {
      expect(ref.current).toBeNull();
    });
  });

  it('returns unique ref objects for each element', () => {
    const refs = useMultipleRefs(3);
    expect(refs[0]).not.toBe(refs[1]);
    expect(refs[1]).not.toBe(refs[2]);
    expect(refs[0]).not.toBe(refs[2]);
  });

  it('returns objects with a current property', () => {
    const refs = useMultipleRefs(2);
    refs.forEach((ref) => {
      expect(ref).toHaveProperty('current');
    });
  });

  it('handles large length values', () => {
    const refs = useMultipleRefs(100);
    expect(refs).toHaveLength(100);
    expect(refs[99]).toHaveProperty('current', null);
  });
});
