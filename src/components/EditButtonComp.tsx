import React from 'react';

type EditButtonProps = {
  onButtonClick: (comm: 'add' | 'remove' | 'update') => void;
  command: 'add' | 'remove' | 'update';
  sign: String;
};

export default function EditButtonComp({
  onButtonClick,
  command,
  sign,
}: EditButtonProps) {
  function handleOnClick() {
    onButtonClick(command);
  }

  return <button onClick={handleOnClick}>{sign}</button>;
}
