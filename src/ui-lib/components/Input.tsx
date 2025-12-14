import { ark } from '@ark-ui/react';
import { forwardRef, type ReactNode } from 'react';
import { css } from 'styled-system/css';
import { Box, type HTMLStyledProps, styled } from 'styled-system/jsx';
import { CloseCircleFilled } from './Icon';

const inputWrapperStyles = css({
  position: 'relative',
  w: 'full',
});

const inputStyles = css({
  w: 'full',
  px: 4,
  py: 3,
  border: '1px solid',
  borderColor: 'line.neutral',
  rounded: 'xl',
  textStyle: 'B1_Medium',
  color: 'label.normal',
  bg: 'background.normal',
  outline: 'none',
  transition: 'all 0.2s ease-in-out',
  caretColor: 'primary.heavy',

  _placeholder: {
    color: 'label.alternative',
  },

  _focus: {
    borderColor: 'primary.heavy',
  },

  _disabled: {
    bg: 'background.neutral',
    color: 'label.disable',
    cursor: 'not-allowed',
  },
});

const iconWrapperStyles = css({
  position: 'absolute',
  right: 4,
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'label.disable',
});

const clearButtonStyles = css({
  position: 'absolute',
  right: 4,
  top: '50%',
  transform: 'translateY(-50%)',
  bg: 'transparent',
  border: 'none',
  cursor: 'pointer',
  p: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'label.disable',
  rounded: 'full',
  transition: 'all 0.2s ease-in-out',

  _hover: {
    bg: 'background.neutral',
    color: 'label.normal',
  },
});

type InputProps = Omit<HTMLStyledProps<'input'>, 'onChange'> & {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
  allowClear?: boolean;
};

const StyledInput = styled(ark.input);
const StyledButton = styled(ark.button);

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { icon, allowClear = false, value, onChange, ...rest } = props;

  const showClearButton = allowClear && value && value.length > 0;
  const showIcon = icon && !showClearButton;

  return (
    <Box className={inputWrapperStyles}>
      <StyledInput
        ref={ref}
        type="text"
        className={inputStyles}
        style={showClearButton || showIcon ? { paddingRight: '2.5rem' } : undefined}
        value={value}
        onChange={onChange}
        {...rest}
      />
      {showIcon && <Box className={iconWrapperStyles}>{icon}</Box>}
      {showClearButton && (
        <StyledButton
          type="button"
          className={clearButtonStyles}
          onClick={() => {
            const event = {
              target: { value: '' },
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(event);
          }}
        >
          <CloseCircleFilled />
        </StyledButton>
      )}
    </Box>
  );
});

Input.displayName = 'Input';
