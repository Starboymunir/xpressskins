// Xpress Skins Inc. — Complete asset inventory
// Images: 65 real JPGs downloaded to public/portfolio/
// Videos: 87 real MOV/MP4 files embedded via Google Drive iframe player

/** Returns the local path for a portfolio image (served from public/portfolio/) */
export function driveImg(id: string, _width = 1200): string {
  return `/portfolio/${id}.jpg`;
}

/** Returns a Google Drive video embed URL for iframe playback */
export function driveVideo(id: string): string {
  return `https://drive.google.com/file/d/${id}/preview`;
}

// ─── PORTFOLIO IMAGES (65 real JPGs from Google Drive) ────────────────────────
export const portfolioImages = [
  // Studio & showcase shots
  { id: '1T7a5RDQuv6wPfrbvSZZii6Yt2nMzYcAR', alt: 'Itasha studio shot — front angle', category: 'Full Wrap' },
  { id: '19pWPcT-N-psJHq3uRyTa-hQITrTxJUTq', alt: 'Anime wrap showcase — side profile', category: 'Full Wrap' },
  { id: '1VdhxRldKnVy1Bw-WiTXJ0ZindSmVnvGc', alt: 'Professional wrap installation — studio', category: 'Full Wrap' },
  { id: '1jWQr3BrE_LkBKaVGkRFGsrbUlItbZhQr', alt: 'Completed itasha build — dynamic angle', category: 'Full Wrap' },
  { id: '1mcEwVHe4Kfom5jrY-13uYh_qBAGpUz-a', alt: 'Full body anime wrap — professional finish', category: 'Full Wrap' },
  { id: '1SkLmMQjEmu0Yi0nP-QZWHGunbB_AGi0z', alt: 'Show-ready anime car wrap', category: 'Full Wrap' },
  { id: '1HI2f82JMaISz3MfC1BLA6wEnKUBLFJSF', alt: 'Premium itasha wrap — high gloss finish', category: 'Full Wrap' },
  { id: '1YCPEuFx9FFkt3HnM_vkZMTT19VhMXldz', alt: 'Detailed wrap panel close-up', category: 'Partial Wrap' },
  { id: '1nus0QfhQQWxSsZukZDFM80Beyy8rM_J7', alt: 'Itasha wrap with custom artwork', category: 'Full Wrap' },
  { id: '13vN3MyVnaE58WnDhmoMDT7mugcVd5vje', alt: 'Anime wrap on modern sports car', category: 'Full Wrap' },
  { id: '1IXctyjzyHd1dyw-4xfz_eVT8Gn4L9T0f', alt: 'Completed anime wrap — studio lighting', category: 'Full Wrap' },
  // Build process
  { id: '1n3-Iz5iNxRB0rePgd8tg-dme0FaTGfoW', alt: 'Build process — design alignment', category: 'Full Wrap' },
  { id: '1bz9KUk6YwzRCK72zm3Z3sQ-dbVRehSc8', alt: 'Wrap application in progress', category: 'Full Wrap' },
  { id: '1Eoz9vDo_DVOIJNZ-pIfGGE1g32SDXVeA', alt: 'Detail work — panel edges', category: 'Partial Wrap' },
  { id: '1vFBc9fCPAogQ7O2Fnovo8dsdRXsfuOaI', alt: 'Itasha wrap with glossy lamination', category: 'Full Wrap' },
  { id: '1kf79pi__xLmSnRamX4cLtJY_RVzgQx_I', alt: 'Full body wrap — three quarter view', category: 'Full Wrap' },
  { id: '1VU5_JpxoQr6GquBehlidPMtnedQ8TyqY', alt: 'Anime wrap showcase — outdoor lighting', category: 'Full Wrap' },
  // Car show & event shots
  { id: '1c-L7LIJw6flWH0zCKlS-r8ntRcCPGDhm', alt: 'Itasha at car show', category: 'Full Wrap' },
  { id: '1_-kkmsVYxrNeP3cYTNwXp3WZnzDGlwIq', alt: 'Anime car meet — lineup', category: 'Full Wrap' },
  { id: '1oOY7LLT1jLZ1SxfPgWemfl1B-Z7XwDHp', alt: 'Itasha culture — car show display', category: 'Full Wrap' },
  { id: '1PWqgOBNcRUZX2xRwrLcQxhWNKPj9xEZX', alt: 'Custom wrap exhibition', category: 'Full Wrap' },
  { id: '1I8uQZjGxbk_OMxg71kiBQmGRMhmgXIHW', alt: 'Show-quality anime wrap', category: 'Full Wrap' },
  // Installation session
  { id: '18oPiOQwmJin_6CO9XrEaeLHc9WCXzP96', alt: 'Build session — prep and layout', category: 'Full Wrap' },
  { id: '1So8fnyroQxq5AoUU7WpYL2-1Rrm0ZXuq', alt: 'Vinyl material cutting', category: 'Full Wrap' },
  { id: '1mGZeEne1-cYq_YbyzRbtVB0VHEvqL-sB', alt: 'Design alignment on vehicle', category: 'Full Wrap' },
  { id: '1rm3tXwgq4UXDLR8T-d_iCF64Z42UjyfL', alt: 'Installation — side panel application', category: 'Full Wrap' },
  { id: '1R54iCXWCZnf674GOuoNZSXIuY83I2XLn', alt: 'Detail work — character artwork placement', category: 'Full Wrap' },
  { id: '1Vbae_n8Zw6XLJ6r86uFp-fNHVM8_sYEP', alt: 'Heat gun stretching technique', category: 'Full Wrap' },
  { id: '1RDA5SeqczfYF24z9Uukclz5_H9HJoFrz', alt: 'Rear wrap installation', category: 'Full Wrap' },
  { id: '1S0j-QLM5Alkut8k7YJXQJM35vKGjsI5i', alt: 'Roof panel wrap detail', category: 'Partial Wrap' },
  { id: '16Cy9wJycIxdHOFPyx8bPeTBRm4hHtbDt', alt: 'Hood wrap — anime character art', category: 'Partial Wrap' },
  { id: '1gbmTeXAmaw_zkao2OF2w7sK8EYF-WkNk', alt: 'Trunk area wrap application', category: 'Partial Wrap' },
  { id: '1ZwNZFYqJTqd9DtTBsoYnQ8JM3ktYTN29', alt: 'Fender wrap stretching', category: 'Partial Wrap' },
  { id: '1K2F7RaN7JjS_hE8zPiC0Vlpo0AoFCoqh', alt: 'Edge trimming with precision blade', category: 'Full Wrap' },
  { id: '1dmUf7DJirpmJfN3N6sXr24-SW6-_o9og', alt: 'Door handle wrap detail', category: 'Full Wrap' },
  { id: '1vUFxXWnDOM1jOMf1S6JnLjQEjm8iuy9b', alt: 'Mirror wrap — custom cut', category: 'Partial Wrap' },
  { id: '1-91IgZnP7Fkgwz5S9ukmAMAMH3bYh36m', alt: 'A-pillar wrap technique', category: 'Full Wrap' },
  { id: '1z-lE_Qmt-Kot4Q4bMyDOYI1rHGl6444R', alt: 'Bumper wrap installation', category: 'Full Wrap' },
  { id: '1t4eo8T6L0TAVu93INtkImDCMctHw5ZCA', alt: 'Complete build — pre-reveal', category: 'Full Wrap' },
  { id: '1BFr6Fn-wiiMVAzJnhpMXROma2SyWeSl3', alt: 'Final quality inspection', category: 'Full Wrap' },
  { id: '1zA34ygGZnlOZFcRBWBQ3OcOhFiqynyEL', alt: 'Completed build — overhead view', category: 'Full Wrap' },
  // Outdoor / specialty
  { id: '17o0LNbcJhoUC9eTWCrXGYSnxfJDRk6Vw', alt: 'Itasha in natural lighting', category: 'Full Wrap' },
  { id: '1Y-SYhPBDPWkZLsR607yvvKhlQJN8wh56', alt: 'Anime wrap — street scene', category: 'Full Wrap' },
  // Reveal shots
  { id: '1F4JeZEX8J-3B5znP326Po8JgD-G7ObZ3', alt: 'Build reveal — dramatic angle', category: 'Full Wrap' },
  { id: '1V8pyptArnt_Qy1CAUNo5YqT-QDcP_BeS', alt: 'Customer delivery moment', category: 'Full Wrap' },
  { id: '104gdytz2Ai5-XkdJkKMRfybFUGb7yc4a', alt: 'Completed itasha — front three-quarter', category: 'Full Wrap' },
  { id: '1jKD6IVrv5vvQY4U0yCy_CmbJCL9URqT4', alt: 'Full wrap — low angle shot', category: 'Full Wrap' },
  { id: '101vJeh7ea6eO-Ad83n5zDUGmDcCLqhbF', alt: 'Anime wrap detail — character close-up', category: 'Full Wrap' },
  { id: '1mYmAQKoUtRrqqHxilOnmLZv4ivEaFXD0', alt: 'Premium vinyl finish close-up', category: 'Full Wrap' },
  // Latest builds
  { id: '11kQ1Ab93wRPqxCLwv7mCHiu4-VM9T1Wk', alt: 'Latest build — hood detail', category: 'Full Wrap' },
  { id: '10bvoqisAx5aFFBrD7-DJktO83NclZJiM', alt: 'Fresh install — full side view', category: 'Full Wrap' },
  { id: '1iOPICYZ38nQcQXetyU8VMYWCt-o-niBK', alt: 'New build — rear angle showcase', category: 'Full Wrap' },
  { id: '1xO2x0T2S7bDttX-b0v3b-UQUtMSjUX7l', alt: 'Recent completion — show ready', category: 'Full Wrap' },
  { id: '141ur-8gPAWFOdFs2aa1XoovAtgFR6nXq', alt: 'Latest design — vibrant colors', category: 'Full Wrap' },
  { id: '1xEsh2EfTcZnDNofX9yh7eGBZPn7uq6a0', alt: 'New itasha — passenger side', category: 'Full Wrap' },
  { id: '1cgRLqh19GkO98P8It8aKdFYde_S5XPY9', alt: 'New build close-up — artwork detail', category: 'Partial Wrap' },
  { id: '1Q_jDbBxt3u1KBf0wufVXJ8exZeg461jZ', alt: 'Recent build — driver side', category: 'Full Wrap' },
  { id: '1A7JclbQ26kC6aXoBUx0O3q9D5mKfFI-8', alt: 'Latest wrap — three quarter', category: 'Full Wrap' },
  { id: '1vgru6puVD52C1gq2pFMvxvsEUsxPrs2X', alt: 'Fresh build — rear view', category: 'Full Wrap' },
  { id: '1gzQxlUcAk_-Tg_gF7RgD17QtY-N3LySe', alt: 'Recent wrap — overhead perspective', category: 'Full Wrap' },
  { id: '1mghtQEM5ZhF-7tr6tf6EOjnIMNwlc2L8', alt: 'New install — rooftop detail', category: 'Full Wrap' },
  { id: '167DXL71Y-ztv_goYK_5B96DnBZ-EpwsN', alt: 'Latest itasha — rolling shot', category: 'Full Wrap' },
  { id: '13Otw-H9z_lEoUxQIwVgDAnz8R4BLnAgW', alt: 'Newest build — front bumper angle', category: 'Full Wrap' },
  { id: '1RxHDGtB6_ycyky_Y4PPjy1B6F4zViWH4', alt: 'Recent delivery — customer handoff', category: 'Full Wrap' },
  { id: '1SuerDLKgEZsDJAjpuX_dpbNjkZHVV7L3', alt: 'Fresh itasha — final inspection', category: 'Full Wrap' },
];

// ─── HERO IMAGES (Best shots for homepage carousel) ───────────────────────────
export const heroImages = portfolioImages.slice(0, 6);

// ─── ALL IMAGES (alias for compatibility) ─────────────────────────────────────
export const allImages = portfolioImages;

// ─── VIDEO ASSETS — curated selection for site embeds ─────────────────────────
// Embedded via iframe: <iframe src={driveVideo(id)} allow="autoplay" />
export const videoAssets = [
  { id: '1l3mw1MDSvNQ4fW4VSHaZzuSr4E-TSCMq', title: 'Eduardo Build Showcase', category: 'Showcase' },
  { id: '1WYknRmnQrWKp3QZNuXY87AcWF-ZVOVWI', title: 'Wrap Install — Full Process', category: 'Process' },
  { id: '1PKmDNuHuGe8XsMf3jzCQhN1AiyFyh6yh', title: 'Itasha Build Reveal', category: 'Reveal' },
  { id: '1MCJX2OJ6Ur4brG6izGEDdL_jp12qDrv9', title: 'Design to Delivery', category: 'Process' },
  { id: '1kTFQ0tHisd8RU2HgzETWUG3PpnUDG91j', title: 'Studio Tour & Install', category: 'Process' },
  { id: '1vbeOHaHdDQxz2A2jpcQgDDroqZadNQ1L', title: 'Anime Wrap Showcase', category: 'Showcase' },
  { id: '1cY8_9rBV7AdPawO3Av2nCP5rHFXeaurY', title: 'Before & After Transformation', category: 'Reveal' },
  { id: '1gGijraa-pTYhkLFSnAOHO08mxfB5RNpV', title: 'Customer Reaction Video', category: 'Reveal' },
  { id: '1U1y2BcfDZ5jJa7K_NnHvySh__qAdcWbc', title: 'Wrap Material & Technique', category: 'Process' },
  { id: '1b86XCp1GC5zwoBzouZqWyaO5GMetQFXj', title: 'Rolling Itasha Montage', category: 'Showcase' },
  { id: '1mvTRNnfNtSmPoKNfTDOhVhXGnaxEzIO-', title: 'Event Display Showcase', category: 'Showcase' },
  { id: '1YNN18qPScM2O9wx3uSVq8pogeTepLYAm', title: 'Quick Build Timelapse', category: 'Process' },
];

// ─── ALL VIDEO IDS (complete 87) ──────────────────────────────────────────────
export const allVideoIds = [
  '1YNN18qPScM2O9wx3uSVq8pogeTepLYAm', '1QzWL_geqek24cnTjKWW8lFSvDWrx5Rya',
  '1NLKMgWbgWxaP9Gn_HLNxR2zBN390Wr-C', '1l3mw1MDSvNQ4fW4VSHaZzuSr4E-TSCMq',
  '1-Ga_t4I12mLfit84lzAT7J0ZFg-q179q', '1l89fCdxveklXlIGgm3OQr4ZEp_Nn0_1V',
  '1tXVvA3YPzYpMEz95twmqeGNXFY2_sKqL', '1ad97RBlWjZfO8dtu9vjpOmFjJnYdat4W',
  '1GfEFSzGyfuOnG0k7B3zfNiyQ9ocKGgtm', '1cD9D_zQu1kCTk82fFv9FdHVsV4HaW5oE',
  '1PuTLyZm08EPKdKAjpMfIXEsKnBP3VDDM', '1WN8fwdS5yT2uMVcgpY6y5WYoD5rqmxzi',
  '1vDHun_p7IowR2VgCJF1L_agruuacgg7K', '1Iuks3iUQRBzhIQWclmDb1aT5VGzw4Veg',
  '1ugR6kxADf3tf-4yOw7kTVjCqrt-gxedF', '1zPkzN4IcfIbUsJpdDfIMv3NeHCPoic-J',
  '1sF7vCxSItnPrMKQPGPml3gLJsG2M1vi1', '1ajjKrdlIu5XMscvJmFbu28TqzmAUVpdE',
  '1R7hyK-iyt341Hzyjy4Fqah3V8QMKo-KL', '137YEsoYzs2brFET7kIHCwtzn6KNneOVI',
  '1dqPLINwZv-qI1P0S-KBUitmEZgE6klv6', '1IW2u4MDufaJ6uvm_Nl79Dei1hWYTTmAV',
  '1XZlEY3aWZeukOUasJsoAmz1orOTT9jyc', '1Lo0BNjDkVwoIUCzp4_t_wkJh6-aa2HLp',
  '1-X3Bo27ptrI6hPTFB5d9TYpUbLGUccp9', '1YLtOFNqYEASMlXCUIVc-9YNf2Eb_s_x9',
  '10ANgrHzri-nPWwL6qlu59RArY4748Brh', '1YB6XQKqZLkHdGsLguVAng3l2n8kB15A9',
  '1-JdzYCnyi6I6Hf8aBSGneHY_nNWxbhYo', '1huyqx-26vN78olpLhqpYmSjWnUxuA6m5',
  '18Xesz56ESpmvHBBJ0iHr9elQYrL-118b', '1pvhd5qYkHCgRsoFAnAIFXBxMkb0PbZEG',
  '1EM6T3RR4x7WD9Z98u9RP2hmNhdr0T05S', '1OhtgA5sYzR-qG1LofUdSp-4P2xodwvDz',
  '1Ud-_Dx_OnVriDUfHEp2l9bEaaUWElUZ8', '1uz_mCe1bQ50qc9yCUVoTKkF-khztS6KQ',
  '1kmj-BCDB5f-dmJkdlw-SZb9jGL5-PGUj', '1nBiGb3xDdHloUPqOK8FaBOWo11QFGR52',
  '1ylfOS1dR4vlEwg3s1U5g0L0voGIYD39X', '1DxE-gujt4-cMG5Wx1mwQkck6z_OfchEF',
  '1ivvD1QjnAaovSd2kFnJDyvPqoodq5f-H', '1WD3uXMDvEZzfK31DjAGJ8aOb7qRxOIK5',
  '1gMuwINHIMf5n4idICpIY7NQMY5e5OkjC', '1kxqsLBul20FuMJR9vV2gcx7b5LBLPTRt',
  '1S0JHdT9HWMvp_Em6a7tVSGHwIUvUJGEG', '1ra-ydA6D5nLpMy9AHWpLm6LfT8U9GaUL',
  '19vws6u1G7DPFCAiepx1lcmgk9qKLXtbn', '1N4aLIuZtb4QiiQd08YyBFMReaEhLIKUY',
  '1DIf2ebFUHnJnr_kRfP3pDftbR2O51EFW', '1dKTGSQWYF9PDGjc2CgyhLRdisrauam6H',
  '1t1d5MJ4agl1GDZhrRbXnXcHqj8DIEtoM', '1z0hRPyxJ5m9xV-F6WlGbsrZaYPpp02l6',
  '1i7U_6tknuYYA90PuuctCGkWtd28KMZpB', '1_s66p1hiYRoaYcDyX7a9GW0NN35bN_2B',
  '1F7Sxz2g8v9IlgK64gzc1ymdez5ni23-W', '14hETiYkrIocncPC_fNJ8BokGEIZ5xzV-',
  '1GTNhfErPnKDUSFjwWAIYgyta7bBdW_YV', '1Rmh4OlMwToyj4dcqZwHLDb76jSBHNFlI',
  '1XfP03vxTCxyJIxk3t6EikdHwg2UP_VOQ', '1tDUl1FvlOxHHPMlGBja9RAVgUqamuKW2',
  '1q2uIOnloP2TiN3xTF6w6v4GSAHpBphr0', '1vLFqNxNW_dgmAvcpYC7hRRNvCu6KuUgi',
  '1310Q5LwOcQ4iTYWMKAXJArCkIFix1MIZ', '19a9Azgq02MxaYE6n5chOgTO_xtpzd3Ax',
  '13JNWLr2iOx9nV-wjwh8JSwJxW4lgpxxM', '1HYfPGo7K9t_1V6lbJCRZuBsH6znzl2sU',
  '1UUA9QoMD-YOkZxjJf0Oqzty6SrCPkcYY', '1ZlokM7QgCrUmCV34xNTAmpEvLqo26wNY',
  '1ZJXd8fXLT91w0qWpnMt-hsbLNmrxhmKY', '1HRopKEWdolOf_YGNIr0FTFliuZyo6C9B',
  '1YDZBvCJpVvx_ZrnmsBBELkPaG2tG779H', '1UHJuzNQmMxat21TMelmXLraSqn8e1hbc',
  '1fWWgcCM7gZZbVMqCzQq-Q-WjydBSQoQU', '1ihfW-i28JsTQSpO38xLbUoqvtu1AJC4q',
  '1DSmQ3-9R3mrisqJAUxXGplVv5G2rVAq9', '1mvTRNnfNtSmPoKNfTDOhVhXGnaxEzIO-',
  '1WYknRmnQrWKp3QZNuXY87AcWF-ZVOVWI', '1PKmDNuHuGe8XsMf3jzCQhN1AiyFyh6yh',
  '1MCJX2OJ6Ur4brG6izGEDdL_jp12qDrv9', '1kTFQ0tHisd8RU2HgzETWUG3PpnUDG91j',
  '1vbeOHaHdDQxz2A2jpcQgDDroqZadNQ1L', '1cY8_9rBV7AdPawO3Av2nCP5rHFXeaurY',
  '1gGijraa-pTYhkLFSnAOHO08mxfB5RNpV', '1U1y2BcfDZ5jJa7K_NnHvySh__qAdcWbc',
  '1b86XCp1GC5zwoBzouZqWyaO5GMetQFXj',
];

// ─── ITASHA PROJECT NAMES ─────────────────────────────────────────────────────
export const itashaProjects = [
  '1-8 Kia Soul Itasha',
  'Angel Tacoma Persona 5',
  'Ara Culture',
  'Azur Lane',
  'Benny Corolla Itasha',
  'Bunsama Danmachi FRS',
  'Cyberpunk Lucy GR Corolla',
  'Despair Box',
  'Dre Vshojo CBR',
  'Ecchi Gang Bike',
  'Ghost Data Itasha',
  'Hellsing Tacoma Itasha',
];
