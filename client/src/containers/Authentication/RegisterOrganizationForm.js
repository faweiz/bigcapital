import React, { useMemo, useState, useCallback } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Row, Col } from 'react-grid-system';
import {
  Button,
  Intent,
  FormGroup,
  InputGroup,
  MenuItem,
  Classes,
  Position,
} from '@blueprintjs/core';
import moment from 'moment';
import classNames from 'classnames';
import { TimezonePicker } from '@blueprintjs/timezone';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { DateInput } from '@blueprintjs/datetime';
import { momentFormatter, tansformDateValue } from 'utils';
import AppToaster from 'components/AppToaster';
import { ListSelect, ErrorMessage, FieldRequiredHint } from 'components';
import { useHistory } from 'react-router-dom';
import withSettingsActions from 'containers/Settings/withSettingsActions';
import withRegisterOrganizationActions from './withRegisterOrganizationActions';
import { compose, optionsMapToArray } from 'utils';

function RegisterOrganizationForm({ requestSubmitOptions, requestSeedTenant }) {
  const { formatMessage } = useIntl();
  const [selected, setSelected] = useState();
  const history = useHistory();

  const baseCurrency = [
    { id: 0, name: 'LYD - Libyan Dinar', value: 'LYD' },
    { id: 1, name: 'USD - American Dollar', value: 'USD' },
  ];

  const languages = [
    { id: 0, name: 'English', value: 'en' },
    { id: 1, name: 'Arabic', value: 'ar' },
  ];

  const fiscalYear = [
    {
      id: 0,
      name: `${formatMessage({ id: 'january' })} - ${formatMessage({
        id: 'december',
      })}`,
      value: 'january',
    },
    {
      id: 1,
      name: `${formatMessage({ id: 'february' })} - ${formatMessage({
        id: 'january',
      })}`,
      value: 'february',
    },
    {
      id: 2,
      name: `${formatMessage({ id: 'march' })} - ${formatMessage({
        id: 'february',
      })}`,
      value: 'March',
    },
    {
      id: 3,
      name: `${formatMessage({ id: 'april' })} - ${formatMessage({
        id: 'march',
      })}`,
      value: 'april',
    },
    {
      id: 4,
      name: `${formatMessage({ id: 'may' })} - ${formatMessage({
        id: 'april',
      })}`,
      value: 'may',
    },
    {
      id: 5,
      name: `${formatMessage({ id: 'june' })} - ${formatMessage({
        id: 'may',
      })}`,
      value: 'june',
    },
    {
      id: 6,
      name: `${formatMessage({ id: 'july' })} - ${formatMessage({
        id: 'june',
      })}`,
      value: 'july',
    },
    {
      id: 7,
      name: `${formatMessage({ id: 'august' })} - ${formatMessage({
        id: 'july',
      })}`,
      value: 'August',
    },
    {
      id: 8,
      name: `${formatMessage({ id: 'september' })} - ${formatMessage({
        id: 'august',
      })}`,
      value: 'september',
    },
    {
      id: 9,
      name: `${formatMessage({ id: 'october' })} - ${formatMessage({
        id: 'november',
      })}`,
      value: 'october',
    },
    {
      id: 10,
      name: `${formatMessage({ id: 'november' })} - ${formatMessage({
        id: 'october',
      })}`,
      value: 'november',
    },
    {
      id: 11,
      name: `${formatMessage({ id: 'december' })} - ${formatMessage({
        id: 'november',
      })}`,
      value: 'december',
    },
  ];

  const ValidationSchema = Yup.object().shape({
    name: Yup.string()
      .required()
      .label(formatMessage({ id: 'organization_name_' })),
    date_start: Yup.date()
      .required()
      .label(formatMessage({ id: 'date_start_' })),
    base_currency: Yup.string()
      .required()
      .label(formatMessage({ id: 'base_currency_' })),
    language: Yup.string()
      .required()
      .label(formatMessage({ id: 'language' })),
    fiscal_year: Yup.string()
      .required()
      .label(formatMessage({ id: 'fiscal_year_' })),
    time_zone: Yup.string(),
  });

  const initialValues = useMemo(
    () => ({
      name: '',
      date_start: moment(new Date()).format('YYYY-MM-DD'),
      base_currency: '',
      language: '',
      fiscal_year: '',
      time_zone: '',
    }),
    [],
  );

  const {
    values,
    errors,
    touched,
    handleSubmit,
    setFieldValue,
    getFieldProps,
    isSubmitting,
  } = useFormik({
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: (values, { setSubmitting, setErrors }) => {
      const options = optionsMapToArray(values).map((option) => {
        return { key: option.key, ...option, group: 'organization' };
      });
      requestSubmitOptions({ options })
        .then((response) => {
          requestSeedTenant().then(() => {
            setSubmitting(false);
          });
        })
        .catch((erros) => {
          setSubmitting(false);
        });
    },
  });

  const onItemsSelect = (filedName) => {
    return (filed) => {
      setSelected({
        ...selected,
        [filedName]: filed,
      });
      setFieldValue(filedName, filed.value);
    };
  };

  const filterItems = (query, item, _index, exactMatch) => {
    const normalizedTitle = item.name.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return normalizedTitle.indexOf(normalizedQuery) >= 0;
    }
  };

  const onItemRenderer = (item, { handleClick }) => (
    <MenuItem key={item.id} text={item.name} onClick={handleClick} />
  );

  const handleTimeZoneChange = useCallback(
    (time_zone) => {
      setFieldValue('time_zone', time_zone);
    },
    [setFieldValue],
  );

  const handleDateChange = useCallback(
    (date) => {
      const formatted = moment(date).format('YYYY-MM-DD');
      setFieldValue('date_start', formatted);
    },
    [setFieldValue],
  );

  return (
    <div className={'register-organizaton-form'}>
      <div className={'register-org-title'}>
        <h2>
          <T id={'let_s_get_started'} />
        </h2>
        <p>
          <T id={'tell_the_system_a_little_bit_about_your_organization'} />
        </p>
      </div>

      <form onClick={handleSubmit}>
        <h3>
          <T id={'organization_details'} />
        </h3>

        <FormGroup
          label={<T id={'name'} />}
          labelInfo={<FieldRequiredHint />}
          className={'form-group--name'}
          intent={errors.name && touched.name && Intent.DANGER}
          helperText={<ErrorMessage {...{ errors, touched }} name={'name'} />}
        >
          <InputGroup
            intent={errors.name && touched.name && Intent.DANGER}
            {...getFieldProps('name')}
          />
        </FormGroup>

        {/* financial starting date */}
        <FormGroup
          label={<T id={'financial_starting_date'} />}
          labelInfo={<FieldRequiredHint />}
          intent={errors.date_start && touched.date_start && Intent.DANGER}
          helperText={
            <ErrorMessage name="date_start" {...{ errors, touched }} />
          }
          className={classNames('form-group--select-list', Classes.FILL)}
        >
          <DateInput
            {...momentFormatter('MMMM Do YYYY')}
            value={tansformDateValue(values.date_start)}
            onChange={handleDateChange}
            popoverProps={{ position: Position.BOTTOM, minimal: true }}
          />
        </FormGroup>
        <Row>
          {/* base currency */}
          <Col width={300}>
            <FormGroup
              label={<T id={'base_currency'} />}
              labelInfo={<FieldRequiredHint />}
              className={classNames(
                'form-group--base-currency',
                'form-group--select-list',
                Classes.LOADING,
                Classes.FILL,
              )}
              intent={
                errors.base_currency && touched.base_currency && Intent.DANGER
              }
              helperText={
                <ErrorMessage name={'base_currency'} {...{ errors, touched }} />
              }
            >
              <ListSelect
                items={baseCurrency}
                noResults={<MenuItem disabled={true} text="No results." />}
                itemRenderer={onItemRenderer}
                popoverProps={{ minimal: true }}
                onItemSelect={onItemsSelect('base_currency')}
                itemPredicate={filterItems}
                selectedItem={values.base_currency}
                selectedItemProp={'value'}
                // defaultText={<T id={'select_base_currency'} />}
                defaultText={'LYD - Libyan Dinar'}
                labelProp={'name'}
              />
            </FormGroup>
          </Col>

          {/* language */}
          <Col width={300}>
            <FormGroup
              label={<T id={'language'} />}
              labelInfo={<FieldRequiredHint />}
              className={classNames(
                'form-group--language',
                'form-group--select-list',
                Classes.FILL,
              )}
              intent={errors.language && touched.language && Intent.DANGER}
              helperText={
                <ErrorMessage name={'language'} {...{ errors, touched }} />
              }
            >
              <ListSelect
                items={languages}
                noResults={<MenuItem disabled={true} text="No results." />}
                itemRenderer={onItemRenderer}
                popoverProps={{ minimal: true }}
                onItemSelect={onItemsSelect('language')}
                itemPredicate={filterItems}
                selectedItem={values.language}
                selectedItemProp={'value'}
                defaultText={'English'}
                // defaultText={<T id={'select_language'} />}
                labelProp={'name'}
              />
            </FormGroup>
          </Col>
        </Row>
        {/* fiscal Year */}
        <FormGroup
          label={<T id={'fiscal_year'} />}
          labelInfo={<FieldRequiredHint />}
          className={classNames(
            'form-group--fiscal_year',
            'form-group--select-list',
            Classes.FILL,
          )}
          intent={errors.fiscal_year && touched.fiscal_year && Intent.DANGER}
          helperText={
            <ErrorMessage name={'fiscal_year'} {...{ errors, touched }} />
          }
        >
          <ListSelect
            items={fiscalYear}
            noResults={<MenuItem disabled={true} text="No results." />}
            itemRenderer={onItemRenderer}
            popoverProps={{ minimal: true }}
            onItemSelect={onItemsSelect('fiscal_year')}
            itemPredicate={filterItems}
            selectedItem={values.fiscal_year}
            selectedItemProp={'value'}
            defaultText={'January - December'}
            // defaultText={<T id={'select_fiscal_year'} />}
            labelProp={'name'}
          />
        </FormGroup>

        {/* Time zone */}
        <FormGroup
          label={<T id={'time_zone'} />}
          className={classNames(
            'form-group--time-zone',
            'form-group--select-list',
            Classes.FILL,
          )}
          intent={errors.time_zone && touched.time_zone && Intent.DANGER}
          helperText={
            <ErrorMessage {...{ errors, touched }} name={'time_zone'} />
          }
        >
          <TimezonePicker
            value={values.time_zone}
            onChange={handleTimeZoneChange}
            valueDisplayFormat="composite"
            showLocalTimezone={true}
            placeholder={<T id={'select_time_zone'} />}
          />
        </FormGroup>

        <p className={'register-org-note'}>
          <T
            id={
              'note_you_can_change_your_preferences_later_in_dashboard_if_needed'
            }
          />
        </p>
        <div className={'register-org-button'}>
          <Button
            intent={Intent.PRIMARY}
            loading={isSubmitting}
            type="submit"
            //  loading={isSubmitting}
          >
            <T id={'save_continue'} />
          </Button>
        </div>
      </form>
    </div>
  );
}

export default compose(
  withSettingsActions,
  withRegisterOrganizationActions,
)(RegisterOrganizationForm);
