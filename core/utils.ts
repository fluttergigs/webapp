//@ts-ignore
//@ts-ignore
import slugify from '@sindresorhus/slugify';
import { customAlphabet } from 'nanoid';





export const generateUserName = (email: string) => {
  const nanoid = customAlphabet(`1234567890fluttergigs${email}`, 20);
  return `${nanoid()}`;
};

export const generateJobOfferSlug = ({
  jobTitle,
  companyName,
}: {
  companyName: string;
  jobTitle: string;
}) => {
  const jobTitleSlug = slugify(jobTitle, { lowercase: true });
  const companyNameSlug = slugify(companyName, { lowercase: true });
  const nanoid = customAlphabet(`1234567890${jobTitleSlug}-at-${companyNameSlug}`, 6);
  return `${jobTitleSlug}-${companyNameSlug}-${nanoid()}`;
};

export const checkDigit = (event: KeyboardEvent) => {
  if (event.key.length === 1 && isNaN(Number(event.key))) {
    event.preventDefault();
  }
};

const isMarkdown = (text: string | String): boolean => {
  const markdownSyntaxRegex = /^(#|\*|-|>`|!)|(\[.*\]\(.*\))/m;

  // @ts-ignore
  return markdownSyntaxRegex.test(text);
};

String.prototype.isMarkdown = function () {
  return isMarkdown(this);
};
