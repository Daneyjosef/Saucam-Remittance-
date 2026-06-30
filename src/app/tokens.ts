/**
 * Design tokens as TypeScript constants.
 * Use these in MUI `sx` props — MUI natively supports CSS custom properties.
 * e.g.  sx={{ color: color.primary, boxShadow: shadow.md }}
 */

export const tokens = {
  color: {
    primary:        'var(--color-primary)',
    primaryHover:   'var(--color-primary-hover)',
    primaryLight:   'var(--color-primary-light)',
    primarySubtle:  'var(--color-primary-subtle)',
    primaryDark:    'var(--color-primary-dark)',

    accent:         'var(--color-accent)',
    accentHover:    'var(--color-accent-hover)',
    accentLight:    'var(--color-accent-light)',
    accentSubtle:   'var(--color-accent-subtle)',

    admin:          'var(--color-admin)',
    adminHover:     'var(--color-admin-hover)',
    adminDeep:      'var(--color-admin-deep)',
    adminSubtle:    'var(--color-admin-subtle)',

    info:           'var(--color-info)',
    infoSubtle:     'var(--color-info-subtle)',

    warning:        'var(--color-warning)',
    warningDark:    'var(--color-warning-dark)',
    warningSubtle:  'var(--color-warning-subtle)',

    danger:         'var(--color-danger)',
    dangerHover:    'var(--color-danger-hover)',
    dangerSubtle:   'var(--color-danger-subtle)',

    success:        'var(--color-success)',
    successSubtle:  'var(--color-success-subtle)',

    bg:             'var(--color-bg)',
    bgSubtle:       'var(--color-bg-subtle)',
    surface:        'var(--color-surface)',
    surfaceMuted:   'var(--color-surface-muted)',
    surfaceSubtle:  'var(--color-surface-subtle)',
    border:         'var(--color-border)',
    borderStrong:   'var(--color-border-strong)',

    text1:          'var(--color-text-1)',
    text2:          'var(--color-text-2)',
    text3:          'var(--color-text-3)',
    text4:          'var(--color-text-4)',
    textInverse:    'var(--color-text-inverse)',
    overlay:        'var(--color-overlay)',

    successBg:      'var(--color-success-bg)',
    successBorder:  'var(--color-success-border)',
    dangerBg:       'var(--color-danger-bg)',
    dangerBorder:   'var(--color-danger-border)',
    warningBg:      'var(--color-warning-bg)',
    warningBorder:  'var(--color-warning-border)',
    infoBg:         'var(--color-info-bg)',
    infoBorder:     'var(--color-info-border)',
    purpleBg:       'var(--color-purple-bg)',
    purpleBorder:   'var(--color-purple-border)',
    purple:         'var(--color-purple)',
    purpleDark:     'var(--color-purple-dark)',
    purpleSubtle:   'var(--color-purple-subtle)',
  },

  grad: {
    primary: 'var(--grad-primary)',
    admin:   'var(--grad-admin)',
    accent:  'var(--grad-accent)',
    surface: 'var(--grad-surface)',
    card:    'var(--grad-card)',
  },

  font: {
    display: 'var(--font-display)',
    body:    'var(--font-body)',
    mono:    'var(--font-mono)',
  },

  text: {
    xs:   'var(--text-xs)',
    sm:   'var(--text-sm)',
    base: 'var(--text-base)',
    md:   'var(--text-md)',
    lg:   'var(--text-lg)',
    xl:   'var(--text-xl)',
    '2xl':'var(--text-2xl)',
    '3xl':'var(--text-3xl)',
    '4xl':'var(--text-4xl)',
    '5xl':'var(--text-5xl)',
    '6xl':'var(--text-6xl)',
  },

  weight: {
    regular:   'var(--weight-regular)',
    medium:    'var(--weight-medium)',
    semibold:  'var(--weight-semibold)',
    bold:      'var(--weight-bold)',
    extrabold: 'var(--weight-extrabold)',
  },

  leading: {
    tight:   'var(--leading-tight)',
    snug:    'var(--leading-snug)',
    normal:  'var(--leading-normal)',
    relaxed: 'var(--leading-relaxed)',
  },

  tracking: {
    tight:   'var(--tracking-tight)',
    normal:  'var(--tracking-normal)',
    wide:    'var(--tracking-wide)',
    wider:   'var(--tracking-wider)',
    widest:  'var(--tracking-widest)',
  },

  space: {
    px:    'var(--space-px)',
    '0-5': 'var(--space-0-5)',
    '1':   'var(--space-1)',
    '1-5': 'var(--space-1-5)',
    '2':   'var(--space-2)',
    '2-5': 'var(--space-2-5)',
    '3':   'var(--space-3)',
    '3-5': 'var(--space-3-5)',
    '4':   'var(--space-4)',
    '5':   'var(--space-5)',
    '6':   'var(--space-6)',
    '7':   'var(--space-7)',
    '8':   'var(--space-8)',
    '9':   'var(--space-9)',
    '10':  'var(--space-10)',
    '11':  'var(--space-11)',
    '12':  'var(--space-12)',
    '14':  'var(--space-14)',
    '16':  'var(--space-16)',
    '20':  'var(--space-20)',
    '24':  'var(--space-24)',
  },

  radius: {
    none: 'var(--radius-none)',
    xs:   'var(--radius-xs)',
    sm:   'var(--radius-sm)',
    md:   'var(--radius-md)',
    lg:   'var(--radius-lg)',
    xl:   'var(--radius-xl)',
    '2xl':'var(--radius-2xl)',
    pill: 'var(--radius-pill)',
  },

  shadow: {
    xs:           'var(--shadow-xs)',
    sm:           'var(--shadow-sm)',
    md:           'var(--shadow-md)',
    lg:           'var(--shadow-lg)',
    xl:           'var(--shadow-xl)',
    '2xl':        'var(--shadow-2xl)',
    glowPrimary:  'var(--shadow-glow-primary)',
    glowAccent:   'var(--shadow-glow-accent)',
    glowAdmin:    'var(--shadow-glow-admin)',
    glowDanger:   'var(--shadow-glow-danger)',
    inner:        'var(--shadow-inner)',
    card:         'var(--shadow-card)',
    glow:         'var(--shadow-glow)',
  },

  duration: {
    instant: 'var(--duration-instant)',
    fast:    'var(--duration-fast)',
    base:    'var(--duration-base)',
    slow:    'var(--duration-slow)',
    slower:  'var(--duration-slower)',
    slowest: 'var(--duration-slowest)',
  },

  ease: {
    linear: 'var(--ease-linear)',
    in:     'var(--ease-in)',
    out:    'var(--ease-out)',
    inOut:  'var(--ease-in-out)',
    spring: 'var(--ease-spring)',
    bounce: 'var(--ease-bounce)',
  },

  transition: {
    colors:    'var(--transition-colors)',
    shadow:    'var(--transition-shadow)',
    transform: 'var(--transition-transform)',
    all:       'var(--transition-all)',
    slowAll:   'var(--transition-slow-all)',
    fast:      'var(--transition-fast)',
    base:      'var(--transition-base)',
    slow:      'var(--transition-slow)',
  },

  z: {
    below:    'var(--z-below)',
    base:     'var(--z-base)',
    raised:   'var(--z-raised)',
    dropdown: 'var(--z-dropdown)',
    sticky:   'var(--z-sticky)',
    overlay:  'var(--z-overlay)',
    modal:    'var(--z-modal)',
    toast:    'var(--z-toast)',
    tooltip:  'var(--z-tooltip)',
  },

  opacity: {
    disabled: 'var(--opacity-disabled)',
    muted:    'var(--opacity-muted)',
    subtle:   'var(--opacity-subtle)',
  },
} as const;

export const { color, grad, font, text, weight, leading, tracking, space, radius, shadow, duration, ease, transition, z, opacity } = tokens;

export default tokens;
