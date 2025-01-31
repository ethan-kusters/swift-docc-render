/**
 * This source file is part of the Swift.org open source project
 *
 * Copyright (c) 2021 Apple Inc. and the Swift project authors
 * Licensed under Apache License v2.0 with Runtime Library Exception
 *
 * See https://swift.org/LICENSE.txt for license information
 * See https://swift.org/CONTRIBUTORS.txt for Swift project authors
*/

import { shallowMount } from '@vue/test-utils';
import ImageAsset from 'docc-render/components/ImageAsset.vue';

jest.mock('docc-render/stores/AppStore', () => ({
  state: {
    preferredColorScheme: 'auto',
    supportsAutoColorScheme: true,
    setPreferredColorScheme: jest.fn(),
  },
}));

describe('ImageAsset', () => {
  it('renders an image that has one light variant', () => {
    const url = 'https://www.example.com/image.png';
    const alt = 'This is alt text.';
    const wrapper = shallowMount(ImageAsset, {
      propsData: {
        variants: [
          {
            traits: [
              '2x',
              'light',
            ],
            url,
            size: {
              width: 1202,
              height: 630,
            },
          },
        ],
        alt,
      },
    });

    const picture = wrapper.find('picture');
    expect(picture.contains('source')).toBe(false);

    const image = picture.find('img');

    expect(image.attributes('src')).toBe(url);
    expect(image.attributes('srcset')).toBe(`${url} 2x`);
    expect(image.attributes('width')).toBe('1202');
    expect(image.attributes('height')).toBe('auto');
    expect(image.attributes('alt')).toBe(alt);
  });

  it('renders an image that has one variant with no appearance trait', () => {
    const url = 'https://www.example.com/image.png';
    const wrapper = shallowMount(ImageAsset, {
      propsData: {
        variants: [
          {
            traits: [
              '1x',
            ],
            url,
            size: {
              width: 300,
              height: 200,
            },
          },
        ],
      },
    });

    const picture = wrapper.find('picture');
    expect(picture.contains('source')).toBe(false);

    const image = picture.find('img');

    expect(image.attributes('src')).toBe(url);
    expect(image.attributes('srcset')).toBe(`${url} 1x`);
    expect(image.attributes('width')).toBe('300');
    expect(image.attributes('height')).toBe('auto');
    expect(image.attributes('alt')).toBe('');
  });

  it('renders an image that has two light variants', () => {
    const url2x = 'https://www.example.com/image-2x.png';
    const url3x = 'https://www.example.com/image-3x.png';
    const wrapper = shallowMount(ImageAsset, {
      propsData: {
        variants: [
          {
            traits: [
              '3x',
              'light',
            ],
            url: url3x,
            size: {
              width: 1202,
              height: 630,
            },
          },
          {
            traits: [
              '2x',
              'light',
            ],
            url: url2x,
            size: {
              width: 1202,
              height: 630,
            },
          },
        ],
      },
    });

    const picture = wrapper.find('picture');
    expect(picture.contains('source')).toBe(false);

    const image = wrapper.find('img');

    expect(image.attributes('src')).toBe(url2x);
    expect(image.attributes('srcset')).toBe(`${url2x} 2x, ${url3x} 3x`);
    expect(image.attributes('width')).toBe('1202');
    expect(image.attributes('height')).toBe('auto');
  });

  it('renders an image that has two dark variants', () => {
    const url2x = 'https://www.example.com/image-2x.png';
    const url3x = 'https://www.example.com/image-3x.png';
    const wrapper = shallowMount(ImageAsset, {
      propsData: {
        variants: [
          {
            traits: [
              '3x',
              'dark',
            ],
            url: url3x,
            size: {
              width: 1202,
              height: 630,
            },
          },
          {
            traits: [
              '2x',
              'dark',
            ],
            url: url2x,
            size: {
              width: 1202,
              height: 630,
            },
          },
        ],
      },
    });

    const picture = wrapper.find('picture');
    const source = picture.find('source');

    expect(source.attributes('media')).toBe('(prefers-color-scheme: dark)');
    expect(source.attributes('srcset')).toBe(`${url2x} 2x, ${url3x} 3x`);

    const image = wrapper.find('img');

    // The img tag should have the dark variant's attributes.
    expect(image.attributes('src')).toBe(url2x);
    expect(image.attributes('srcset')).toBe(`${url2x} 2x, ${url3x} 3x`);
    expect(image.attributes('width')).toBe('1202');
    expect(image.attributes('height')).toBe('auto');
  });

  it('renders an image that has light and dark variants', () => {
    const url1x = 'https://www.example.com/image-1x.png';
    const url2x = 'https://www.example.com/image-2x.png';
    const url3x = 'https://www.example.com/image-3x.png';
    const wrapper = shallowMount(ImageAsset, {
      propsData: {
        variants: [
          {
            traits: [
              '1x',
              'light',
            ],
            url: url1x,
            size: {
              width: 1202,
              height: 630,
            },
          },
          {
            traits: [
              '3x',
            ],
            url: url3x,
            size: {
              width: 1202,
              height: 630,
            },
          },
          {
            traits: [
              '2x',
              'dark',
            ],
            url: url2x,
            size: {
              width: 1202,
              height: 630,
            },
          },
        ],
      },
    });

    const picture = wrapper.find('picture');
    const source = picture.find('source');

    expect(source.attributes('media')).toBe('(prefers-color-scheme: dark)');
    expect(source.attributes('srcset')).toBe(`${url2x} 2x`);

    const image = wrapper.find('img');

    expect(image.attributes('src')).toBe(url1x);
    expect(image.attributes('srcset')).toBe(`${url1x} 1x, ${url3x} 3x`);
    expect(image.attributes('width')).toBe('1202');
    expect(image.attributes('height')).toBe('auto');
  });

  it('renders a fallback image if the specified one does not load', () => {
    const url = 'https://www.example.com/image.png';
    const alt = 'This is alt text.';
    const wrapper = shallowMount(ImageAsset, {
      propsData: {
        variants: [
          {
            traits: [
              '2x',
              'light',
            ],
            url,
            size: {
              width: 1202,
              height: 630,
            },
          },
        ],
        alt,
      },
    });

    const picture = wrapper.find('picture');
    expect(picture.exists()).toBe(true);
    const img = picture.find('img');
    expect(img.exists()).toBe(true);
    expect(img.classes('fallback')).toBe(false);

    // simulate an error loading the real image
    img.trigger('error');

    expect(wrapper.find('picture').exists()).toBe(false);
    const fallbackImg = wrapper.find('img');
    expect(fallbackImg.exists()).toBe(true);
    expect(fallbackImg.classes('fallback')).toBe(true);
    expect(fallbackImg.attributes('alt')).toBe(alt);
    expect(fallbackImg.attributes('title')).toBe('Image failed to load');
  });
});
