import ShirtLogo from './ShirtLogo';

const Logo = ({ size = 'default', showText = true }) => {
  const sizes = {
    small: { icon: 28, text: '18px', tracking: '2px' },
    default: { icon: 36, text: '22px', tracking: '2px' },
    large: { icon: 48, text: '28px', tracking: '2px' },
  };

  const s = sizes[size] || sizes.default;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <ShirtLogo size={s.icon} />
      </div>
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{
            fontSize: s.text,
            fontWeight: 800,
            color: '#8B1E2D',
            letterSpacing: s.tracking,
            fontFamily: "Inter, sans-serif",
            lineHeight: 1.2,
          }}>
            STYLE ANALYSER
          </span>
          <span style={{
            fontSize: '11px',
            fontWeight: 500,
            color: '#9B9B9B',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}>
            Shirt Manufacturing
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
