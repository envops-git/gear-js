import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createPayloadTypeStructure, decodeHexTypes, GearKeyring, Hex, Metadata } from '@gear-js/api';
import { Button, Input } from '@gear-js/ui';
import { GetMetaResponse } from 'api/responses';
import { getMeta } from 'services';
import { getPreformattedText } from 'helpers';
import { useAccount, useApi } from 'hooks';
import { Payload } from './children';
import styles from './Form.module.scss';
import { web3FromSource } from '@polkadot/extension-dapp';

type Params = { destination: Hex };
type MetadataResponse = { result: GetMetaResponse | undefined };

const initValues = { payload: '{ "RequestForMembership": "123" }', gasLimit: '20000000', value: '0' };

const Form = () => {
  const { api } = useApi();
  const { account } = useAccount();
  const { destination } = useParams() as Params;

  const [meta, setMeta] = useState<Metadata>();
  const [values, setValues] = useState(initValues);

  const getParsedMeta = ({ result }: MetadataResponse) =>
    result ? (JSON.parse(result.meta) as Metadata) : Promise.reject('No metadata');

  const getTypeStructure = ({ types, handle_input: handleInput }: Metadata) =>
    types && handleInput
      ? createPayloadTypeStructure(handleInput, decodeHexTypes(types), true)
      : Promise.reject("Can't decode");

  const updateMeta = (parsedMeta: Metadata) => {
    setMeta(parsedMeta);
    return parsedMeta;
  };

  const updatePayload = (payload: string) => {
    setValues((prevValues) => ({ ...prevValues, payload }));
  };

  const updateGasLimit = (gasLimit: string) => {
    setValues((prevValues) => ({ ...prevValues, gasLimit }));
  };

  useEffect(() => {
    getMeta(destination)
      .then(getParsedMeta)
      .then(updateMeta)
      .then(getTypeStructure)
      .then(getPreformattedText)
      // .then(updatePayload)
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const calculateGas = () => {
    if (account && meta) {
      const { address } = account;
      const { payload, value } = values;
      const publicKey = GearKeyring.decodeAddress(address);

      api.program.gasSpent
        .handle(publicKey, destination, payload, value, meta)
        .then((gas) => gas.toString())
        .then(updateGasLimit);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (account) {
      const { address } = account;
      const { source } = account.meta;
      const message = { destination, ...values };

      api.message.submit(message, meta);

      web3FromSource(source)
        .then(({ signer }) => ({ signer }))
        .then((options) => api.message.signAndSend(address, options));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input label="Destination:" className={styles.input} value={destination} readOnly />
      <Payload name="payload" value={values.payload} onChange={handleChange} />
      <Input
        label="Gas limit:"
        className={styles.input}
        name="gasLimit"
        value={values.gasLimit}
        onChange={handleChange}
      />
      <Input label="Value:" className={styles.input} name="value" value={values.value} onChange={handleChange} />
      <div className={styles.buttons}>
        {/* omit type='button' after gear-ui update */}
        <Button text="Calculate gas" color="secondary" type="button" onClick={calculateGas} />
        <Button text="Send message" type="submit" />
      </div>
    </form>
  );
};

export { Form };
