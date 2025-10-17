// Theme is taken form current monitoring plugin: https://github.com/openshift/monitoring-plugin/blob/main/web/src/components/dashboards/perses/PersesWrapper.tsx

import { useEffect, useState } from 'react';
import { getTheme as persesGetTheme, typography } from '@perses-dev/components';
import { ThemeOptions } from '@mui/material';

const PF_THEME_DARK_CLASS_V6 = 'pf-v6-theme-dark';
const PF_THEME_DARK_CLASS_V5 = 'pf-v5-theme-dark';
const PF_THEME_DARK_CLASS_V4 = 'pf-theme-dark';

import { chart_color_blue_100, chart_color_blue_200, chart_color_blue_300, t_color_gray_95, t_color_white } from '@patternfly/react-tokens';

/**
 * The @openshift-console/dynamic-plugin-sdk package does not expose the
 * theme setting of the user preferences, therefore check if the root
 * <html> element has the PatternFly css class set for the dark theme.
 */
function getTheme(): 'light' | 'dark' {
  const classList = document.documentElement.classList;
  if (classList.contains(PF_THEME_DARK_CLASS_V4) || classList.contains(PF_THEME_DARK_CLASS_V5) || classList.contains(PF_THEME_DARK_CLASS_V6)) {
    return 'dark';
  }
  return 'light';
}

const mapPatterflyThemeToMUI = (theme: 'light' | 'dark'): ThemeOptions => {
  const isDark = theme === 'dark';
  const primaryTextColor = isDark ? t_color_white.value : t_color_gray_95.value;
  const primaryBackgroundColor = 'var(--pf-t--global--background--color--primary--default)';

  return {
    typography: {
      ...typography,
      fontFamily: 'var(--pf-t--global--font--family--body)',
      subtitle1: {
        // Card Heading
        fontFamily: 'var(--pf-t--global--font--family--heading)',
        fontWeight: 'var(--pf-t--global--font--weight--heading--default)',
        lineHeight: 'var(--pf-v6-c-card__title-text--LineHeight)',
        fontSize: 'var(--pf-t--global--font--size--heading--sm)',
      },
      h2: {
        // Panel Group Heading
        color: 'var(--pf-t--global--text--color--brand--default)',
        fontWeight: 'var(--pf-t--global--font--weight--body--default)',
        fontSize: 'var(--pf-t--global--font--size--600)',
      },
    },
    palette: {
      primary: {
        light: chart_color_blue_100.value,
        main: chart_color_blue_200.value,
        dark: chart_color_blue_300.value,
        contrastText: primaryTextColor,
      },
      secondary: {
        main: primaryTextColor,
        light: primaryTextColor,
        dark: primaryTextColor,
      },
      background: {
        default: primaryBackgroundColor,
        paper: primaryBackgroundColor,
        navigation: primaryBackgroundColor,
        code: primaryBackgroundColor,
        tooltip: primaryBackgroundColor,
        lighter: primaryBackgroundColor,
        border: primaryBackgroundColor,
      },
      text: {
        primary: primaryTextColor,
        secondary: primaryTextColor,
        disabled: primaryTextColor,
        navigation: primaryTextColor,
        accent: primaryTextColor,
        link: primaryTextColor,
        linkHover: primaryTextColor,
      },
    },
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            // Custom Time Range Selector
            '&.MuiClock-meridiemText': {
              color: primaryTextColor,
            },
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: theme === 'dark' ? t_color_white.value : t_color_gray_95.value,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 'var(--pf-t--global--border--radius--medium)',
            borderColor: 'var(--pf-t--global--border--color--default)',
          },
        },
      },
      MuiCardHeader: {
        styleOverrides: {
          root: {
            '&.MuiCardHeader-root': {
              borderBottom: 'none',
              paddingBlockEnd: 'var(--pf-t--global--spacer--md)',
              paddingBlockStart: 'var(--pf-t--global--spacer--lg)',
              paddingLeft: 'var(--pf-t--global--spacer--lg)',
              paddingRight: 'var(--pf-t--global--spacer--lg)',
            },
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            '&.MuiCardContent-root': {
              borderTop: 'none',
              '&:last-child': {
                paddingBottom: 'var(--pf-t--global--spacer--lg)',
                paddingLeft: 'var(--pf-t--global--spacer--lg)',
                paddingRight: 'var(--pf-t--global--spacer--lg)',
              },
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: 'var(--pf-t--global--border--color--default)',
          },
          root: {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--pf-t--global--border--color--default)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--pf-t--global--border--color--default)',
            },
          },
          input: {
            // Dashboard Variables >> Text Variable
            padding: '8.5px 14px',
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          icon: {
            color: primaryTextColor,
          },
        },
      },
    },
  };
};

/**
 * In case the user sets "system default" theme in the user preferences,
 * update the theme if the system theme changes.
 */
export function usePatternFlyTheme() {
  const [theme, setTheme] = useState(getTheme());

  useEffect(() => {
    const reloadTheme = () => setTheme(getTheme());
    const mq = window.matchMedia('(prefers-color-scheme: dark)');

    mq.addEventListener('change', reloadTheme);
    return () => mq.removeEventListener('change', reloadTheme);
  }, [setTheme]);

  const muiTheme = persesGetTheme(theme, {
    shape: {
      borderRadius: 6,
    },
    ...mapPatterflyThemeToMUI(theme),
  });

  return muiTheme;
}
