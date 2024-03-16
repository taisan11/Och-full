import { intro, outro, confirm, select, multiselect, spinner, isCancel, cancel, text } from '@clack/prompts';
import { $ } from "bun";

export async function init(path?: string) {
  intro('Och-CLI is a CLI tool for Och');
  if (!path) {
    path = await text({
      message: 'インストール先のパスを教えてください',
      placeholder: './och',
    })
  }
}