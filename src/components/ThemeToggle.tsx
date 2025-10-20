import { Switch } from '@patternfly/react-core';
import { MoonIcon, SunIcon } from '@patternfly/react-icons';
import { useTheme } from '../hooks/useTheme';

interface ThemeToggleProps {
  label?: string;
  showIcons?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ThemeToggle = ({
  label = 'Dark mode',
  showIcons = true,
  size = 'md'
}: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--pf-t--global--spacer--sm)'
    }}>
      {showIcons && (
        <SunIcon
          style={{
            color: isDark
              ? 'var(--pf-t--global--text--color--subtle)'
              : 'var(--pf-t--global--color--warning--default)'
          }}
        />
      )}
      <Switch
        id="theme-toggle"
        label={label}
        labelOff=""
        isChecked={isDark}
        onChange={toggleTheme}
        aria-label="Toggle dark mode"
      />
      {showIcons && (
        <MoonIcon
          style={{
            color: isDark
              ? 'var(--pf-t--global--color--brand--default)'
              : 'var(--pf-t--global--text--color--subtle)'
          }}
        />
      )}
    </div>
  );
};

export default ThemeToggle;