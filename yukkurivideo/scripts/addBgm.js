import fs from 'fs';

export function addBgm(
  config,
  bgmPath
) {
  config.bgm = {
    path: bgmPath,
    volume: 0.15,
  };

  return config;
}