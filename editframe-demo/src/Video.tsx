import React from 'react';
import {Timegroup} from '@editframe/react';
import {AutoVideoConfig} from '../../transcripts/autoVideo';

type SceneComponent = React.FC & {duration: number};

const section = AutoVideoConfig.sections[0];
const title = section?.title || '生成AIの活用';
const talks = section?.talks || [];

const withDuration = (component: React.FC, duration: number) =>
  Object.assign(component, {duration}) as SceneComponent;

const SceneTitle = withDuration(() => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '88px 120px',
        background:
          'radial-gradient(circle at top left, rgba(99,102,241,0.28), transparent 42%), linear-gradient(135deg, #0b1020 0%, #111827 50%, #0f172a 100%)',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          gap: 12,
          padding: '10px 16px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.10)',
          color: '#c7d2fe',
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        Gemini prompt → transcript → video
      </div>

      <h1
        style={{
          margin: '28px 0 0',
          fontSize: 84,
          lineHeight: 1.02,
          letterSpacing: '-0.04em',
          maxWidth: 1200,
        }}
      >
        {title}
      </h1>

      <p
        style={{
          margin: '24px 0 0',
          maxWidth: 960,
          fontSize: 28,
          lineHeight: 1.7,
          color: '#cbd5e1',
        }}
      >
        タイトルを Gemini に渡して、台本を自動構築し、そのまま動画化する Editframe のデモです。
      </p>

      <div style={{ display: 'flex', gap: 14, marginTop: 36, flexWrap: 'wrap' }}>
        {['Gemini API', 'Structured Output', 'Editframe'].map((chip) => (
          <div
            key={chip}
            style={{
              padding: '10px 16px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.08)',
              fontSize: 18,
              color: '#e2e8f0',
            }}
          >
            {chip}
          </div>
        ))}
      </div>
    </div>
  );
}, 3000);

const SceneTalks = withDuration(() => {
  const previewTalks = talks.slice(0, 8);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: '64px 80px',
        display: 'grid',
        gridTemplateColumns: '1.35fr 0.85fr',
        gap: 28,
        background: 'linear-gradient(180deg, #0f172a 0%, #111827 100%)',
      }}
    >
      <div
        style={{
          borderRadius: 28,
          padding: 28,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 700, color: '#c7d2fe', marginBottom: 18 }}>
          台本の流れ
        </div>
        <div style={{ display: 'grid', gap: 14 }}>
          {previewTalks.map((talk, index) => {
            const isReimu = talk.speaker === 'reimu' || talk.speaker === 'reimuAndMarisa';
            const bg = isReimu ? 'rgba(248, 113, 113, 0.16)' : 'rgba(96, 165, 250, 0.16)';
            const border = isReimu ? 'rgba(248, 113, 113, 0.25)' : 'rgba(96, 165, 250, 0.25)';

            return (
              <div
                key={`${talk.speaker}-${index}`}
                style={{
                  borderRadius: 20,
                  padding: '16px 18px',
                  background: bg,
                  border: `1px solid ${border}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 12,
                    marginBottom: 8,
                    fontSize: 16,
                    fontWeight: 700,
                    color: isReimu ? '#fecaca' : '#bfdbfe',
                  }}
                >
                  <span>{talk.speaker === 'reimuAndMarisa' ? 'reimu + marisa' : talk.speaker}</span>
                  <span>#{index + 1}</span>
                </div>
                <div style={{ fontSize: 24, lineHeight: 1.55, color: '#f8fafc' }}>{talk.text}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gap: 18,
        }}
      >
        <div
          style={{
            borderRadius: 28,
            padding: 28,
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ fontSize: 20, color: '#a5b4fc', fontWeight: 700 }}>自動生成のポイント</div>
          <ul style={{ margin: '18px 0 0', paddingLeft: 22, fontSize: 24, lineHeight: 1.7, color: '#e2e8f0' }}>
            <li>タイトルから会話の骨組みを作る</li>
            <li>Gemini の structured output で JSON 化</li>
            <li>編集せずそのまま動画の材料にする</li>
          </ul>
        </div>

        <div
          style={{
            borderRadius: 28,
            padding: 28,
            background:
              'linear-gradient(180deg, rgba(99,102,241,0.24), rgba(15,23,42,0.92))',
            border: '1px solid rgba(99,102,241,0.26)',
            minHeight: 260,
          }}
        >
          <div style={{ fontSize: 20, color: '#e0e7ff', fontWeight: 700, marginBottom: 12 }}>
            使ったコマンド
          </div>
          <div
            style={{
              borderRadius: 18,
              padding: '16px 18px',
              background: 'rgba(0,0,0,0.24)',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: 20,
              lineHeight: 1.7,
              color: '#f8fafc',
            }}
          >
            npm run auto:prompt -- &quot;{title}&quot;
          </div>
        </div>
      </div>
    </div>
  );
}, 7000);

const SceneClosing = withDuration(() => {
  const lastTalk = talks[talks.length - 1]?.text || 'ゆっくりしていってね！';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '80px 120px',
        background:
          'radial-gradient(circle at center, rgba(34,197,94,0.18), transparent 34%), linear-gradient(180deg, #020617 0%, #0f172a 100%)',
      }}
    >
      <div
        style={{
          width: 160,
          height: 160,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.08)',
          display: 'grid',
          placeItems: 'center',
          fontSize: 76,
          marginBottom: 28,
        }}
      >
        ✦
      </div>
      <h2 style={{ margin: 0, fontSize: 72, lineHeight: 1.05, letterSpacing: '-0.04em' }}>
        自動生成から動画化まで、
        <br />
        ひとつの流れにまとめました
      </h2>
      <p style={{ margin: '24px 0 0', maxWidth: 980, fontSize: 28, lineHeight: 1.8, color: '#cbd5e1' }}>
        {lastTalk}
      </p>
      <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['Gemini', 'Editframe', 'Video render'].map((chip) => (
          <div
            key={chip}
            style={{
              padding: '10px 16px',
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(255,255,255,0.06)',
              color: '#f8fafc',
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {chip}
          </div>
        ))}
      </div>
    </div>
  );
}, 3500);

export const Video: React.FC = () => (
  <Timegroup
    mode="sequence"
    className="relative overflow-hidden"
    style={{ width: 1920, height: 1080, background: '#0b1020' }}
  >
    <SceneTitle />
    <SceneTalks />
    <SceneClosing />
  </Timegroup>
);
