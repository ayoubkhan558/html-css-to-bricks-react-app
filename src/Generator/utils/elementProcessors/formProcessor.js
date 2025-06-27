import { getUniqueId } from '../utils';

export const getBricksFieldType = (node) => {
  const type = (node.getAttribute('type') || 'text').toLowerCase();
  console.log("getBricksFieldType: Form input type ", type);
  const tagName = node.tagName.toLowerCase();

  if (tagName === 'textarea') return 'textarea';
  if (tagName === 'select') return 'select';

  switch (type) {
    case 'email': return 'email';
    case 'password': return 'password';
    case 'file': return 'file';
    case 'checkbox': return 'checkbox';
    case 'submit': return 'submit';
    case 'tel': return 'tel';
    case 'number': return 'number';
    case 'url': return 'url';
    case 'date':
    case 'datetime-local':
    case 'time':
    case 'month':
    case 'week': return 'date';
    default: return 'text';
  }
};

export const processFormField = (form, node) => {
  console.log("processFormField form, node", form, node);
  const tagName = node.tagName.toLowerCase();
  if (!['input', 'select', 'textarea', 'button'].includes(tagName)) return null;

  const type = node.getAttribute('type')?.toLowerCase() || 'text';

  // Skip hidden and submit buttons (handled separately)
  if (type === 'hidden' || (tagName === 'button' && type === 'submit')) {
    return null;
  }

  const field = {
    type: getBricksFieldType(node),
    id: getUniqueId().substring(0, 6),
    name: node.getAttribute('name') || '',
    label: '',
    placeholder: node.getAttribute('placeholder') || '',
    required: node.hasAttribute('required'),
    value: node.getAttribute('value') || ''
  };
  console.log("processFormField: Form input type ", type);

  // Handle labels
  if (node.id) {
    const label = form.querySelector(`label[for="${node.id}"]`);
    if (label) {
      field.label = label.textContent.replace('*', '').replace(':', '').trim();
    }
  }

  // Handle specific field types
  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
      if (node.hasAttribute('minlength')) field.minLength = node.getAttribute('minlength');
      if (node.hasAttribute('maxlength')) field.maxLength = node.getAttribute('maxlength');
      break;
    case 'tel':
    case 'url':
      if (node.hasAttribute('minlength')) field.minLength = node.getAttribute('minlength');
      if (node.hasAttribute('maxlength')) field.maxLength = node.getAttribute('maxlength');
      break;

    case 'number':
      if (node.hasAttribute('min')) field.min = node.getAttribute('min');
      if (node.hasAttribute('max')) field.max = node.getAttribute('max');
      if (node.hasAttribute('step')) field.step = node.getAttribute('step');
      break;

    case 'date':
      field.dateFormat = type === 'datetime-local' ? 'Y-m-d\TH:i' :
        type === 'time' ? 'H:i' :
          type === 'month' ? 'Y-m' :
            type === 'week' ? 'Y-\WW' : 'Y-m-d';
      break;

    case 'file':
      field.fileUploadLimit = '1';
      field.fileUploadSize = '1';
      if (node.hasAttribute('accept')) {
        field.fileUploadAllowedTypes = node.getAttribute('accept');
      }
      break;

    case 'checkbox':
      // For checkboxes, use the label text as the option
      field.label = field.label || (node.nextSibling?.nodeValue?.trim() || '');
      field.options = field.label;
      if (!field.placeholder) {
        field.placeholder = field.label || field.name;
      }
      break;

    case 'select':
    case 'textarea':
      field.options = Array.from(node.querySelectorAll('option'))
        .map(opt => opt.textContent.trim())
        .join('\n');
      field.valueLabelOptions = true;
      break;
  }

  return field;
};

export const processFormElement = (formNode) => {
  console.log("processFormElement formNode", formNode);
  const formElement = {
    id: getUniqueId().substring(0, 6),
    name: 'form',
    parent: 0,
    children: [],
    settings: {
      fields: [],
      submitButtonStyle: 'primary',
      actions: ['email'],
      successMessage: 'Message successfully sent. We will get back to you as soon as possible.',
      emailSubject: 'Contact form request',
      emailTo: 'admin_email',
      fromName: 'bricks',
      emailErrorMessage: 'Submission failed. Please reload the page and try to submit the form again.',
      htmlEmail: true,
      mailchimpPendingMessage: 'Please check your email to confirm your subscription.',
      mailchimpErrorMessage: 'Sorry, but we could not subscribe you.',
      sendgridErrorMessage: 'Sorry, but we could not subscribe you.',
      showLabels: true,
      submitButtonText: 'Submit'
    }
  };

  // Process all form fields
  const fieldElements = Array.from(formNode.querySelectorAll('input, select, textarea, button'));

  fieldElements.forEach(fieldEl => {
    const field = processFormField(formNode, fieldEl);
    if (field) {
      if (field.type === 'submit') {
        formElement.settings.submitButtonText = fieldEl.textContent.trim() || 'Submit';
      } else {
        formElement.settings.fields.push(field);
      }
    }
  });

  // Add form attributes
  const formAttrs = ['action', 'method', 'enctype', 'autocomplete', 'novalidate', 'target'];
  formAttrs.forEach(attr => {
    if (formNode.hasAttribute(attr)) {
      formElement.settings[attr] = formNode.getAttribute(attr);
    }
  });

  return formElement;
};