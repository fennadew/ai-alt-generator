/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/home.module.css";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

const models = [
  "Salesforce/blip-image-captioning-large",
  "nlpconnect/vit-gpt2-image-captioning",
];

const Home: NextPage = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState("");
  const [selectedModel, setModel] = useState(models[0]);
  const [altText, setAltText] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (imageFile) {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("model", selectedModel);

      fetch("/api/generate", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          const { generated_text } = data;
          setAltText(generated_text);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  };

  const handleChangleModel = (e: ChangeEvent<HTMLInputElement>) => {
    setModel(e.target.value);
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target as HTMLInputElement;
    if (!files || files.length === 0) return;
    const file = files[0];

    const imageSrc = URL.createObjectURL(file);
    setImageSrc(imageSrc);
    setImageFile(file);
    setAltText("");
  };

  useEffect(() => {
    if (imageFile && selectedModel) {
      formRef.current?.requestSubmit();
    }
  }, [imageFile, selectedModel]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Alt Image Generator</title>
        <meta name="description" content="Alt image generator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.h1}>Alt Image Generator</h1>
      <form className={styles.form} ref={formRef} onSubmit={onSubmit}>
        <div className={styles.radioContainer}>
          {models.map((model) => (
            <label key={model}>
              <input
                type="radio"
                name="model"
                value={model}
                onChange={handleChangleModel}
                checked={selectedModel === model}
              />
              {model}
            </label>
          ))}
        </div>
        <input
          type="file"
          id="file"
          name="file"
          accept=".jpg, .jpeg, .png"
          onChange={handleImageUpload}
          className={styles.input}
        />
        <label htmlFor="file">Choose file to upload</label>
      </form>

      <img className={styles.preview} src={imageSrc} alt={altText} />

      {loading ? <p>Loading...</p> : altText ? <p>{altText}</p> : null}
    </div>
  );
};

export default Home;
