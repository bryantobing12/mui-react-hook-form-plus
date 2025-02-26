import * as React from 'react';
import { Controller, FieldPath, FieldValues, FormState, UseControllerProps } from 'react-hook-form';
import {
	Checkbox,
	CheckboxProps,
	FormControl,
	FormControlLabel,
	FormControlLabelProps,
	FormHelperText,
	FormLabel,
	Grid,
	GridProps,
} from '@mui/material';

import { callAll } from '@utils/misc';

export interface HookCheckBoxProps<T extends FieldValues = FieldValues> extends UseControllerProps<T> {
	checkBoxProps?: CheckboxProps;
	formControlLabelProps?: Omit<FormControlLabelProps, 'control'>;
	gridProps?: GridProps;
	formHelperText?: string;
	groupCheckProps?: {
		name: FieldPath<T>;
		checkBoxProps?: CheckboxProps;
		formControlLabelProps?: Omit<FormControlLabelProps, 'control'>;
	}[];
	formState: FormState<T>;
	label?: string;
	disabled?: any;
	error?: {
		value: boolean;
		message?: string;
	};
}

// ====================================================

/**
 *
 * @description A radio input field that uses react-hook-form to manage the form state.
 * @param {HookCheckBoxProps}
 *
 * formState: The form state to use from the useHookForm hook that we are using.
 * label: The label to use for the radio group
 * fields: The fields to use for the radio group
 * defaultValue: The default value to use for the radio group
 *
 * @returns {React.ReactElement}
 *
 */

// ====================================================

export const HookCheckBox = <T extends FieldValues>({
	gridProps,
	...props
}: HookCheckBoxProps<T>): React.ReactElement => {
	if (gridProps) {
		return (
			<Grid item {...gridProps}>
				<Component {...props} />
			</Grid>
		);
	}

	return <Component {...props} />;
};

/**
 *
 * @description The actual component that is returned from the HookCheckBox component
 *
 * @danger do not remove {formState: { errors }} from props as it is subscribed to the state
 *
 */
const Component = <T extends FieldValues>({
	formState: { errors: _errors },
	checkBoxProps = {},
	label,
	disabled,
	formHelperText,
	groupCheckProps,
	formControlLabelProps = { label: undefined },
	error,
	...restC
}: HookCheckBoxProps<T>) => {
	const { onChange, ...restCheckBox } = checkBoxProps;

	/**
	 * we don't want to pass onChange to the CheckBox
	 * we want to use the hook-form onChange,
	 * but we also want to keep the onChange passed in the checkBoxProps,
	 * so we use callAll to merge the two
	 */
	const onChangeRef = React.useRef(onChange);
	/**
	 * we update the ref on every render
	 */
	onChangeRef.current = onChange;

	return (
		<FormControl component='fieldset' error={!!error?.value}>
			{label && <FormLabel component='legend'>{label}</FormLabel>}
			{!!groupCheckProps ? (
				groupCheckProps.map(({ name, checkBoxProps, formControlLabelProps }) => (
					<React.Fragment key={name}>
						<Controller
							{...restC}
							name={name}
							render={({ field: { onChange: onChangeI, name, value = false, ref } }) => (
								<>
									<FormControlLabel
										{...(formControlLabelProps as any)}
										control={
											<Checkbox
												ref={ref}
												name={name}
												checked={value}
												{...restCheckBox}
												onChange={callAll(onChangeI, onChangeRef.current)}
											/>
										}
									/>
								</>
							)}
						/>
					</React.Fragment>
				))
			) : (
				<Controller
					{...restC}
					render={({ field: { onChange: onChangeI, name, value = false, ref } }) => (
						<>
							<FormControlLabel
								{...formControlLabelProps}
								control={
									<Checkbox
										ref={ref}
										name={name}
										checked={value}
										{...checkBoxProps}
										onChange={callAll(onChangeI, onChangeRef.current)}
									/>
								}
							/>
						</>
					)}
				/>
			)}
			<FormHelperText>{(!!error?.value && error?.message) || formHelperText}</FormHelperText>
		</FormControl>
	);
};
