import './App.css';
import profile from './assets/images/profile.jpg';
import money from './assets/images/money.png';
import { useEffect, useState } from 'react';
import movies from './data.js'

function App() {
  const [banner, setBanner] = useState("banner");
  const [favoritado, setFavoritado] = useState(false);
  const [filtro, setFiltro] = useState('todos');
  const [filtroAtivo, setFiltroAtivo] = useState('todos');
  const [carrinho, setCarrinho] = useState([]);
  const [valorTotal, setValorTotal] = useState(0);
  const [desconto, setDesconto] = useState(1);
  const [pesquisar, setPesquisar] = useState("");
  const filmes = movies;
  let stringPesqeuisar = "";

  function esconderBanner() {
    setBanner("banner banner-hide");
    setDesconto(0.9);
  }

  function aplicarCupom(e) {
    if (e.key !== 'Enter' || e.target.value !== "htmlnaoelinguagem") {
      return;
    } else {
      setDesconto(0.9);
      setBanner("banner banner-hide");
      e.target.value = "";
    }
  }

  function favoritarFilme(i) {
    filmes[i].isStarred = !favoritado;
    setFavoritado(!favoritado);
  }

  function handleFiltro(novoFiltro) {
    setFiltro(novoFiltro);
    setFiltroAtivo(novoFiltro);
  }

  function handleCarrinho(i) {
    if (carrinho.find(filme => filme.title === filmes[i].title)) {
      const i2 = carrinho.findIndex(filme => filme.title === filmes[i].title);
      carrinho[i2].quantidade += 1;
      setCarrinho([...carrinho])
      setValorTotal(valorTotal + carrinho[i2].price)
    } else {
      const filmeAdd = {
        title: filmes[i].title,
        price: filmes[i].price,
        backgroundImg: filmes[i].backgroundImg,
        quantidade: 1,
      }
      setCarrinho([...carrinho, filmeAdd]);
      setValorTotal(valorTotal + filmeAdd.price)
    }
    
  }
  
  function handleAumentarQtd(i) {
    carrinho[i].quantidade += 1;
    setCarrinho([...carrinho]);
    setValorTotal(valorTotal + carrinho[i].price)
  }
  
  function handleDiminuirQtd(i) {
    carrinho[i].quantidade -= 1;
    setCarrinho([...carrinho]);
    setValorTotal(valorTotal - carrinho[i].price);
  }
  
  function handleExcluirFilme(i) {
    setValorTotal(valorTotal - carrinho[i].price);
    carrinho.splice(i, 1);
    setCarrinho([...carrinho])
  }

  function Filtros() {
    return (
      <div className="Filtros">
        <button className={filtroAtivo === 'todos' ? "filtro-ativo" : ""} onClick={() => handleFiltro('todos')}>Todos</button>
        <button className={filtroAtivo === 'action' ? "filtro-ativo" : ""} onClick={() => handleFiltro('action')}>Ação</button>
        <button className={filtroAtivo === 'romance' ? "filtro-ativo" : ""} onClick={() => handleFiltro('romance')}>Romance</button>
        <button className={filtroAtivo === 'science fiction' ? "filtro-ativo" : ""} onClick={() => handleFiltro('science fiction')}>Ficção Científica</button>
        <button className={filtroAtivo === 'horror' ? "filtro-ativo" : ""} onClick={() => handleFiltro('horror')}>Terror</button>
      </div>
    )
  }

  function filtrarFilmes(filme) {
    if (filtro === 'todos') return filmes;
    if (filtro === 'action' && filme.categories.includes('action')) return filmes;
    if (filtro === 'romance' && filme.categories.includes('romance')) return filmes;
    if (filtro === 'science fiction' && filme.categories.includes('science fiction')) return filmes;
    if (filtro === 'horror' && filme.categories.includes('horror')) return filmes;
  }

  function handlePesquisar(e) {
    if (e.key !== "Enter") {
      return;
    } else {
      setPesquisar(stringPesqeuisar);
    }
  }

  function handleInput(e) {
    stringPesqeuisar = e.target.value;
  }

  function handleSearch() {
    setPesquisar(stringPesqeuisar);
  }

  function pesquisarFilme(filme) {
    const nomeFilmeMin = filme.title.toLowerCase();
    setPesquisar(pesquisar.toLowerCase())
    if (!pesquisar) {
      return filmes
    } else {
      if (nomeFilmeMin.includes(pesquisar)) return filmes;
    }
  }

  function cartazFilmes(array) {
    return array.map((filme, i) => {
      return (
        <div className="cartaz-filme" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.05),rgba(0, 0, 0, 0.5)), url(${filme.backgroundImg})` }}>
          <svg className={filme.isStarred ? "fav-icon favoritado" : "fav-icon"} onClick={() => favoritarFilme(i)} width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2L11.7961 7.52786H17.6085L12.9062 10.9443L14.7023 16.4721L10 13.0557L5.29772 16.4721L7.09383 10.9443L2.39155 7.52786H8.20389L10 2Z" stroke="white" stroke-opacity="0.83" />
          </svg>
          <div className="titulo-botao">
            <div className="titulo">
              <h3>{filme.title}</h3>
              <p>
                <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.5 0L7.95934 4.49139H12.6819L8.86126 7.26722L10.3206 11.7586L6.5 8.98278L2.6794 11.7586L4.13874 7.26722L0.318133 4.49139H5.04066L6.5 0Z" fill="#FBCD6E" />
                </svg>
                {filme.starsCount}
              </p>
            </div>
            <button className="add-sacola" onClick={() => handleCarrinho(i)}>Sacola <span>R$ {parseInt(filme.price)},{`${(filme.price % 1) * 10}`.padEnd(2, "0")}</span></button>
          </div>
        </div>
      )
    })
  }

  function TopFilmes() {
    const topFilmes = filmes.slice(0, 5);
    return cartazFilmes(topFilmes);
  }

  function Filmes() {
    return cartazFilmes(filmes.filter(pesquisarFilme).filter(filtrarFilmes));
  }

  function Sacola() {
    return (
      <div>
        {carrinho.length === 0 ?
          <div className="sacola-vazia">
            <h1>Sua sacola está vazia</h1>
            <p>Adicione filmes agora</p>
            <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M164.86 83.0158L97.1252 57.8908C95.0627 57.1408 92.8127 58.1721 92.0627 60.2346L46.3127 183.375C45.5627 185.438 46.594 187.688 48.6565 188.438L116.391 213.563C118.453 214.313 120.703 213.281 121.453 211.219L167.203 88.0315C167.953 86.0158 166.922 83.7658 164.86 83.0158Z" fill="#593F8F" />
              <path opacity="0.09" d="M124.266 146.109C122.579 146.109 120.844 146.062 119.063 145.969C92.766 144.516 71.2973 132.797 61.641 114.656C46.2191 85.6874 61.3598 45.3281 84.5629 32.6249C96.2816 26.1562 106.453 26.3437 112.922 27.6562C123.985 29.8593 132.141 34.9687 135.891 41.9999C139.922 49.5468 137.766 56.6249 135.469 64.078C133.407 70.7812 131.297 77.6718 133.829 85.1249C136.079 91.7812 141.938 93.8437 148.172 96.0468C154.5 98.2968 161.063 100.594 164.578 107.859C168.282 115.547 167.813 126.047 163.547 132.375C157.735 140.812 142.36 146.109 124.266 146.109ZM105.61 27.4687C99.8441 27.4687 92.6723 28.7812 84.8441 33.0937C61.8754 45.7031 46.8754 85.7343 62.1566 114.422C71.7191 132.422 93.0473 144 119.157 145.453C139.219 146.578 156.891 141.187 163.125 132.094C167.297 125.953 167.766 115.641 164.11 108.141C160.688 101.062 154.266 98.8124 148.032 96.6093C141.703 94.3593 135.704 92.2499 133.36 85.3593C130.782 77.7187 132.938 70.7343 135 63.9374C137.25 56.578 139.407 49.5937 135.469 42.2343C131.813 35.3437 123.75 30.3281 112.875 28.1718C110.766 27.7499 108.329 27.4687 105.61 27.4687Z" fill="#AAAAD5" />
              <path opacity="0.2" d="M148.453 76.9219L140.953 81.9375L75.4688 125.906L65.1094 132.891L79.3594 94.4062L89.7656 87.4219L113.25 71.625L120.75 66.6094L148.453 76.9219Z" fill="#EEEDF3" />
              <path opacity="0.2" d="M163.359 82.4531L155.859 87.4688L67.7813 146.625L57.375 153.563L62.4375 140.016L72.7969 133.078V133.031L146.109 83.8594L153.609 78.7969L163.359 82.4531Z" fill="#EEEDF3" />
              <path d="M164.859 83.0158L163.359 82.4533L153.609 78.844L148.453 76.9221L120.75 66.6565L97.1251 57.8908C95.1094 57.1408 92.8126 58.1721 92.0626 60.2346L79.3594 94.4533L65.0626 132.938L62.3907 140.11L57.3751 153.656L46.3126 183.469C46.1719 183.844 46.1251 184.219 46.0782 184.594C45.9376 186.281 46.9688 187.922 48.6563 188.531L61.2188 193.219L70.6876 196.735L95.7188 206.016L104.859 209.391L116.391 213.656C118.406 214.406 120.703 213.375 121.453 211.36L166.359 90.4221L167.203 88.1721C167.953 86.0158 166.922 83.7658 164.859 83.0158ZM158.438 90.6565L157.5 93.2346L118.828 197.438C118.406 198.516 117.188 199.125 116.063 198.703L107.578 195.563L97.3126 191.766L76.1251 183.891L66.4219 180.281L58.6876 177.422C57.8438 177.094 57.3282 176.344 57.3282 175.5C57.3282 175.219 57.3282 174.938 57.4688 174.656L67.8751 146.672L72.8907 133.125L75.5626 125.953L89.8594 87.469L97.1251 67.9221C97.5469 66.844 98.7657 66.2346 99.8438 66.6565L113.344 71.6721L141.047 81.9377L146.203 83.8596L155.953 87.469L157.219 87.9377C158.297 88.3596 158.859 89.5783 158.438 90.6565Z" fill="#EEEDF3" />
              <path d="M80.625 195.937C78.7031 195.234 77.7187 193.078 78.4219 191.156C79.125 189.234 81.2812 188.25 83.2031 188.953C85.125 189.656 86.1093 191.812 85.4062 193.734C84.6562 195.703 82.5 196.641 80.625 195.937Z" fill="#C9C7D9" />
              <path d="M179.578 206.25L178.078 197.109L182.203 195.844L182.859 205.594L179.578 206.25Z" fill="#D7DDE9" />
              <path d="M183 204.61C183.281 204.656 183.516 204.75 183.75 204.938C185.203 206.156 189.656 208.313 191.906 208.641C194.344 209.016 194.484 210.188 191.016 210.188C187.594 210.188 185.062 209.86 183.562 209.906C182.016 209.953 182.437 210.188 178.687 210.188C175.781 210.188 176.719 206.485 177.75 204.797C178.078 204.281 178.5 204 179.109 204.047L183 204.61Z" fill="#3F3F3F" />
              <path d="M166.312 197.719L172.031 190.453L175.734 192.656L169.031 199.688L166.312 197.719Z" fill="#D7DDE9" />
              <path d="M169.875 199.125C170.016 199.359 170.156 199.594 170.156 199.875C170.25 201.75 171.703 206.625 173.437 208.172C175.172 209.766 174.047 210.141 171.234 208.828C168.141 207.375 167.437 204.234 166.359 203.156C165.281 202.078 165.375 202.5 162.844 199.734C160.875 197.625 164.203 195.797 166.172 195.375C166.781 195.234 167.25 195.375 167.625 195.891L169.875 199.125Z" fill="#3F3F3F" />
              <path d="M163.734 43.2188C163.734 43.2188 162.609 50.7188 164.766 54.1875C166.922 57.6562 167.25 58.1719 167.25 58.1719" fill="#ED8C61" />
              <path d="M169.266 61.5002C168.656 61.8752 167.953 62.0627 167.297 62.0627C165.985 62.0627 164.672 61.4064 163.969 60.1408C163.922 60.0939 163.547 59.4377 161.531 56.2502C160.125 54.0002 159.656 50.9533 159.61 48.2814C159.516 45.6564 159.797 43.4064 159.938 42.6564C160.266 40.547 162.235 39.047 164.391 39.3752C166.5 39.7033 168 41.672 167.672 43.8283C167.485 44.9533 167.438 46.2658 167.438 47.4846C167.438 48.7502 167.531 49.9689 167.719 50.8596C167.813 51.3752 167.953 51.8439 168.141 52.1252C170.344 55.6408 170.672 56.2033 170.672 56.2033C171.75 58.0314 171.141 60.4221 169.266 61.5002Z" fill="#E8E8E8" />
              <path d="M154.875 104.438C155.672 93.2349 151.922 65.438 150 54.3755C149.719 52.688 150.985 51.1411 152.719 51.1411H175.735C176.953 51.1411 178.078 51.9849 178.406 53.1567C181.031 63.188 182.719 104.391 182.719 104.391H154.875V104.438Z" fill="#3F3F3F" />
              <path d="M192.891 81.141C192.516 79.0316 189.938 73.641 187.078 68.016C184.031 62.0628 180.609 55.7816 179.016 52.9691C178.125 51.3753 176.109 50.8128 174.516 51.6566C172.922 52.5472 172.359 54.5628 173.203 56.1566C175.641 60.5628 178.125 65.2035 180.328 69.3753C182.813 74.1566 185.203 77.0628 186.188 79.4066C184.406 80.9535 179.953 81.0941 176.438 80.8597C175.453 80.766 171.703 80.4847 169.219 82.7816C168.234 83.6722 167.109 85.3128 167.203 87.891C167.297 89.6722 167.531 90.3753 169.125 91.1722C169.781 91.5003 170.625 91.5472 171.328 91.5003C173.156 91.266 173.297 90.2816 173.297 88.1722C173.297 86.6722 174.094 85.1722 174.094 85.1722C174.094 85.1722 179.438 86.4847 183.891 87.0472C188.344 87.6097 190.172 86.7191 191.813 84.891C192.75 83.8128 193.125 82.4535 192.891 81.141Z" fill="#E8E8E8" />
              <path d="M156.094 122.532C156.094 122.532 152.719 116.344 154.875 104.438H182.672C182.672 104.438 183.047 113.485 182.438 122.532H156.094Z" fill="#996CF4" />
              <path d="M187.031 68.0157L183.797 68.672L180.328 69.3751C178.172 65.2032 175.641 60.5157 173.203 56.1564C172.313 54.5626 172.922 52.547 174.516 51.6564C176.109 50.7657 178.125 51.3751 179.016 52.9689C180.563 55.7814 183.984 62.0626 187.031 68.0157Z" fill="black" fill-opacity="0.26" />
              <path d="M155.766 53.7659C155.344 51.9847 153.516 50.9065 151.781 51.3753C143.813 53.344 138.281 55.1253 134.438 56.7659C125.578 60.5159 125.672 63.2815 125.672 64.6878C125.719 66.2815 126.047 69.4222 145.125 76.3597C145.125 76.9222 144.516 79.0784 144.141 79.7815C143.25 81.3753 144.188 82.9222 145.125 84.469C145.453 84.9847 146.203 85.6409 147.094 85.6409C148.266 85.6409 149.719 84.1409 149.906 82.9222C150.609 78.469 150.516 75.844 150.281 75.3284C150.281 75.2815 150.234 75.2347 150.234 75.1878C150.141 75.0472 150.094 74.9065 150 74.7659C149.953 74.6722 149.859 74.6253 149.813 74.5315C149.719 74.4378 149.672 74.344 149.578 74.2972C149.438 74.1565 149.297 74.0628 149.156 73.969C149.109 73.969 149.109 73.9222 149.063 73.9222C148.828 73.7815 148.594 73.6409 148.359 73.5472C141.891 70.8753 135.844 66.5628 133.172 64.6878C134.109 64.1722 135.422 63.5159 137.063 62.9065C141.141 61.2659 147.141 59.344 153.281 57.844C155.109 57.3284 156.188 55.5472 155.766 53.7659Z" fill="#E8E8E8" />
              <path d="M187.547 66.5626L183.094 67.4064L179.625 68.0626L176.672 68.6251C172.875 61.172 171.984 59.4845 171.844 56.9533C171.703 54.0939 172.453 52.6408 174.328 51.6095C176.203 50.5783 178.547 51.2345 179.578 53.1095C179.672 53.2501 183.703 59.0158 187.547 66.5626Z" fill="#3F3F3F" />
              <path d="M199.641 159.282C199.219 162 197.766 164.954 195.703 168.563C192.234 174.563 186.938 181.266 182.156 186.844C178.828 190.735 175.781 194.11 173.859 196.407C173.016 197.391 172.359 198.188 171.984 198.704L168.047 193.641C169.5 191.579 170.859 188.813 172.547 186.235C172.594 186.188 172.641 186.094 172.687 186.047C175.875 181.219 179.297 175.782 182.016 170.813C182.109 170.625 182.203 170.485 182.297 170.297C185.203 165.047 187.359 160.407 187.781 157.688C188.531 152.86 181.266 137.766 174.094 124.454C173.297 122.907 172.453 121.407 171.656 119.954C171.375 119.438 171.234 118.922 171.188 118.36C171 115.922 172.781 113.11 174.984 111.891C177.656 110.391 181.125 109.641 182.625 112.313C185.672 117.844 201.469 147.422 199.641 159.282Z" fill="#996CF4" />
              <path d="M182.156 186.844C178.828 190.734 175.781 194.109 173.859 196.406C173.531 193.688 173.203 190.734 172.875 187.734C172.828 187.172 172.734 186.562 172.688 186C175.875 181.172 179.297 175.734 182.016 170.766C182.203 175.687 182.203 181.453 182.156 186.844Z" fill="black" fill-opacity="0.15" />
              <path d="M181.453 160.781C180.094 149.672 170.766 119.813 169.312 116.531C168.094 113.719 161.344 113.11 158.531 114.375C155.719 115.594 154.453 118.875 155.672 121.688C159.422 130.219 170.062 153.047 171.141 161.11C171.75 165.938 172.594 175.641 174.094 183.938C175.172 189.703 176.25 195.328 177.047 199.406C177.75 202.969 177.75 202.313 177.797 202.641L184.453 201.61C184.453 201.61 183.047 173.906 181.453 160.781Z" fill="#996CF4" />
              <path d="M153.328 57.7502C147.187 59.2502 141.187 61.1721 137.109 62.8127L134.391 56.7189C138.234 55.1252 143.766 53.2971 151.734 51.3283C153.516 50.9064 155.297 51.9846 155.719 53.7189C156.187 55.5471 155.109 57.3283 153.328 57.7502Z" fill="black" fill-opacity="0.26" />
              <path d="M151.828 51.2348C153.937 50.9067 155.484 51.9379 156.047 54.0004C156.609 56.0629 155.203 57.6567 153.328 58.7348C151.078 60.0473 150.281 60.3285 140.766 63.6098L135.469 56.2973C147.656 51.5629 148.266 51.7504 151.828 51.2348Z" fill="#3F3F3F" />
              <path d="M167.672 50.8596C167.485 50.8596 167.297 50.8596 167.156 50.8596C164.297 50.8596 161.672 49.9221 159.61 48.2814C159.516 45.6564 159.797 43.4064 159.938 42.6564C160.266 40.547 162.235 39.047 164.391 39.3752C166.5 39.7033 168 41.672 167.672 43.8283C167.485 44.9533 167.438 46.2658 167.438 47.4846C167.344 48.7033 167.438 49.9221 167.672 50.8596Z" fill="black" fill-opacity="0.26" />
              <path d="M178.688 36.9846C177.141 44.1565 173.157 49.4065 166.266 49.4065C159.422 49.4065 155.11 44.2034 153.844 36.9846C152.719 30.2346 159.422 23.6252 166.266 23.6252C173.203 23.5784 180.141 30.2815 178.688 36.9846Z" fill="#E8E8E8" />
              <path d="M179.625 202.687L179.578 202.5C177.703 190.875 174.844 173.344 173.437 162.281C172.406 154.219 162.422 130.312 158.672 121.781C158.625 121.734 158.625 121.641 158.625 121.594C158.625 121.547 158.625 121.547 158.578 121.5C157.969 119.859 156.141 113.766 157.875 104.156L158.437 104.25C156.703 113.719 158.531 119.672 159.094 121.312C159.094 121.359 159.141 121.406 159.141 121.453C159.141 121.5 159.141 121.547 159.187 121.594C162.937 130.125 172.922 154.125 173.953 162.234C175.406 173.25 178.219 190.828 180.094 202.453L180.141 202.641L179.625 202.687Z" fill="white" fill-opacity="0.13" />
              <path d="M170.719 51.1875C170.719 52.875 170.062 55.6875 165.656 55.6875C162.469 55.6875 158.437 54.3281 156.937 51.75L156.609 51.1875H170.719Z" fill="#26353A" />
              <path d="M157.922 51.1875C159.094 53.25 162.609 54.5625 165.656 54.5625C168.703 54.5625 169.594 53.0625 169.594 51.1875H157.922Z" fill="#E8E8E8" />
              <path d="M174.609 85.8281C174.609 85.7813 174.797 83.9063 172.828 81.1875L174.656 80.1094C176.953 83.5312 176.719 85.9688 176.719 86.1094L174.609 85.8281Z" fill="#82AACE" />
              <path d="M173.203 80.1564C174.234 79.6876 175.593 79.922 176.297 80.672C176.953 81.422 176.672 82.4533 175.593 82.922C174.562 83.3908 173.203 83.1564 172.5 82.4064C171.843 81.6095 172.125 80.6251 173.203 80.1564Z" fill="#4E7DB0" />
              <path d="M178.406 27.7969C174.656 21.75 165.422 21.2813 163.641 21.375C162.703 21.4219 160.641 21.9844 159.75 23.3906C159.703 22.4063 159.75 21.5156 159.75 21.5156C158.953 22.5 158.813 23.3438 158.953 24C158.391 23.25 158.016 22.4531 158.016 22.4531C157.875 23.4844 158.156 24.0938 158.578 24.4219C156.047 25.0313 152.813 28.5938 153.938 35.9063C154.406 39.0938 161.625 36.6563 163.641 33.4688C165 35.6719 167.719 36.1406 167.719 36.1406C166.781 35.2031 165.938 33.7969 165.281 32.3906C169.125 34.7344 174.234 37.2656 174.844 38.8125C174.844 38.8125 175.969 36.3281 175.125 34.7344C175.125 34.7344 178.172 35.4844 178.547 38.5313C178.5 38.4375 182.391 34.2656 178.406 27.7969Z" fill="#424344" />
              <path d="M169.43 104.141L168.875 104.231L171.91 123.019L172.465 122.929L169.43 104.141Z" fill="white" fill-opacity="0.13" />
              <path d="M171.609 119.438L171.516 118.875C171.516 118.875 172.688 118.687 173.297 117.797C173.672 117.281 173.766 116.625 173.672 115.875L171.75 103.969L172.313 103.875L174.234 115.781C174.375 116.719 174.234 117.516 173.766 118.125C173.016 119.25 171.656 119.438 171.609 119.438Z" fill="white" fill-opacity="0.13" />
              <path d="M153.469 36.2343C152.906 37.4531 153 38.7656 153.516 39.8906C154.125 41.2031 156.047 41.1093 156.61 39.7968L158.203 36.2343C158.813 34.9218 157.594 33.4687 156.188 33.8437C155.016 34.2187 153.985 35.0625 153.469 36.2343Z" fill="#E8E8E8" />
              <path d="M91.646 130.428L126.639 108.868C127.423 108.388 128.427 108.434 129.16 109.001C132.485 111.561 135.455 114.157 137.437 116.339C137.437 116.339 139.144 118.087 139.883 119.196C141.076 120.708 141.65 122.686 141.65 124.607C141.65 126.764 141.021 128.803 139.768 130.433C139.484 130.724 138.4 132.007 137.377 133.055C131.407 139.575 115.822 150.348 107.625 153.613C106.432 154.139 103.247 155.238 101.595 155.299C100.003 155.299 98.465 154.952 96.9874 154.19C95.1703 153.143 93.7476 151.518 92.9489 149.591C92.4347 148.252 91.641 144.236 91.641 144.118C91.1269 141.251 90.7425 137.225 90.5528 132.523C90.5178 131.68 90.9422 130.862 91.646 130.428Z" fill="#FCBDEB" />
              <path opacity="0.4" d="M93.9863 118.815C92.4438 119.771 90.5019 118.55 90.5768 116.715C90.7615 112.412 91.081 108.621 91.4704 105.8C91.5303 105.738 92.324 100.736 93.2375 99.0441C94.8299 95.9013 97.9549 93.9799 101.314 93.9799H101.594C103.76 94.0361 108.368 95.9575 108.368 96.0751C110.689 97.0409 113.719 98.6762 116.979 100.644C118.447 101.533 118.482 103.715 117.014 104.619L93.9863 118.815Z" fill="#F089D3" />
            </svg>
            <div className="inserir-cupom">
              <label htmlFor="InserirCupom">Insira seu cupom</label>
              <input onKeyPress={(e) => aplicarCupom(e)} type="text" name="InserirCupom" id="InserirCupom" placeholder="Cupom de desconto" />
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="cupom-icon">
                <path opacity="0.4" d="M10.1203 3.54248V5.55915" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                <path opacity="0.4" d="M10.1203 14.8008V16.4875" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                <path opacity="0.4" d="M10.1203 11.9379V7.92041" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.5726 16.6669C14.8688 16.6669 15.9186 15.4523 15.9186 13.9528V11.7924C15.0609 11.7924 14.3702 10.9933 14.3702 10.001C14.3702 9.0088 15.0609 8.20883 15.9186 8.20883L15.9179 6.04755C15.9179 4.54804 14.8673 3.3335 13.5718 3.3335H4.03772C2.74227 3.3335 1.69166 4.54804 1.69166 6.04755L1.69092 8.27922C2.54862 8.27922 3.23938 9.0088 3.23938 10.001C3.23938 10.9933 2.54862 11.7924 1.69092 11.7924V13.9528C1.69092 15.4523 2.74078 16.6669 4.03698 16.6669H13.5726Z" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
          :
          <div className="sacola-cheia">
            <div className="carrinho">
              {
                carrinho.map((filme, i) => {
                  return (
                    <div className="filme-carrinho">
                      <img src={filme.backgroundImg} alt="" />
                      <div className="titulo-preco">
                        <p style={{ fontWeight: "700" }}>{filme.title}</p>
                        <p>R$ {parseInt(filme.price)},{`${(filme.price % 1) * 10}`.padEnd(2, "0")}</p>
                      </div>
                      <div className="quantidade">
                        <svg className="plus"onClick={() => handleAumentarQtd(i)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g filter="url(#filter0_b)">
                            <rect width="24" height="24" fill="black" fill-opacity="0.37" />
                          </g>
                          <line x1="11.75" y1="4" x2="11.75" y2="19" stroke="#6FCF97" stroke-width="1.5" />
                          <line x1="19" y1="11.75" x2="4" y2="11.75" stroke="#6FCF97" stroke-width="1.5" />
                          <defs>
                            <filter id="filter0_b" x="-15" y="-15" width="54" height="54" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                              <feFlood flood-opacity="0" result="BackgroundImageFix" />
                              <feGaussianBlur in="BackgroundImage" stdDeviation="7.5" />
                              <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
                              <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
                            </filter>
                          </defs>
                        </svg>
                        <span>{filme.quantidade}</span>
                        {
                          filme.quantidade === 1 ?
                            <svg className="trash" onClick={() => handleExcluirFilme(i)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g filter="url(#filter0_c)">
                                <rect width="24" height="24" fill="black" fill-opacity="0.37" />
                              </g>
                              <path opacity="0.4" d="M19.325 9.46777C19.325 9.46777 18.782 16.2028 18.467 19.0398C18.317 20.3948 17.48 21.1888 16.109 21.2138C13.5 21.2608 10.888 21.2638 8.28003 21.2088C6.96103 21.1818 6.13803 20.3778 5.99103 19.0468C5.67403 16.1848 5.13403 9.46777 5.13403 9.46777" stroke="#FF7366" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              <path d="M20.7082 6.23926H3.75024" stroke="#FF7366" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              <path d="M17.4406 6.23949C16.6556 6.23949 15.9796 5.68449 15.8256 4.91549L15.5826 3.69949C15.4326 3.13849 14.9246 2.75049 14.3456 2.75049H10.1126C9.53358 2.75049 9.02558 3.13849 8.87558 3.69949L8.63258 4.91549C8.47858 5.68449 7.80258 6.23949 7.01758 6.23949" stroke="#FF7366" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              <defs>
                                <filter id="filter0_c" x="-15" y="-15" width="54" height="54" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                  <feGaussianBlur in="BackgroundImage" stdDeviation="7.5" />
                                  <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
                                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
                                </filter>
                              </defs>
                            </svg>
                            :
                            <svg className="minus"onClick={() => handleDiminuirQtd(i)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g filter="url(#filter0_d)">
                                <rect width="24" height="24" fill="black" fill-opacity="0.37" />
                              </g>
                              <path d="M20.7082 11.5H3.75024" stroke="#FF7366" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              <defs>
                                <filter id="filter0_d" x="-15" y="-15" width="54" height="54" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                  <feGaussianBlur in="BackgroundImage" stdDeviation="7.5" />
                                  <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
                                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
                                </filter>
                              </defs>
                            </svg>
                        }
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <div className="inserir-cupom">
              <label htmlFor="InserirCupom">Insira seu cupom</label>
              <input onKeyPress={(e) => aplicarCupom(e)} type="text" name="InserirCupom" id="InserirCupom" placeholder="Cupom de desconto" />
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="cupom-icon">
                <path opacity="0.4" d="M10.1203 3.54248V5.55915" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                <path opacity="0.4" d="M10.1203 14.8008V16.4875" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                <path opacity="0.4" d="M10.1203 11.9379V7.92041" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.5726 16.6669C14.8688 16.6669 15.9186 15.4523 15.9186 13.9528V11.7924C15.0609 11.7924 14.3702 10.9933 14.3702 10.001C14.3702 9.0088 15.0609 8.20883 15.9186 8.20883L15.9179 6.04755C15.9179 4.54804 14.8673 3.3335 13.5718 3.3335H4.03772C2.74227 3.3335 1.69166 4.54804 1.69166 6.04755L1.69092 8.27922C2.54862 8.27922 3.23938 9.0088 3.23938 10.001C3.23938 10.9933 2.54862 11.7924 1.69092 11.7924V13.9528C1.69092 15.4523 2.74078 16.6669 4.03698 16.6669H13.5726Z" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <button className="finalizar-compra">Confirme seus dados <span>R$ {valorTotal * desconto}</span></button>
          </div>

        }
      </div>
    )
  }

  return (
    <div className="App">
      <header>
        <svg width="32" height="36" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.84523 21.3983L22.5309 8.74064C23.0166 8.45862 23.6384 8.48562 24.0931 8.81864C26.1534 10.3217 27.9941 11.8458 29.2222 13.1269C29.2222 13.1269 30.2802 14.1529 30.7381 14.8039C31.4774 15.692 31.8332 16.853 31.8332 17.9811C31.8332 19.2472 31.4434 20.4442 30.6669 21.4013C30.4906 21.5723 29.8193 22.3253 29.1851 22.9403C25.4852 26.7685 15.8272 33.0929 10.7476 35.01C10.0083 35.319 8.03461 35.964 7.01065 36C6.02381 36 5.071 35.796 4.15531 35.349C3.02927 34.7339 2.14761 33.7799 1.65264 32.6488C1.33401 31.8628 0.842137 29.5047 0.842137 29.4357C0.523502 27.7526 0.2853 25.3885 0.167746 22.6283C0.146091 22.1333 0.409042 21.6533 0.84523 21.3983Z" fill="#FCBDEB" />
          <path opacity="0.4" d="M2.29534 14.5806C1.33944 15.1416 0.136051 14.4246 0.182454 13.3475C0.296915 10.8214 0.494901 8.59529 0.736197 6.9392C0.773319 6.9032 1.26519 3.96605 1.83131 2.973C2.81815 1.12791 4.7547 -0.000145912 6.83665 -0.000145912H7.00989C8.35248 0.032855 11.2078 1.16091 11.2078 1.22991C12.6463 1.79694 14.5241 2.75699 16.5442 3.91205C17.4537 4.43408 17.4753 5.71514 16.5658 6.24617L2.29534 14.5806Z" fill="#F089D3" />
        </svg>
        <div className="search-container">
          <input onKeyPress={(e) => handlePesquisar(e)} onInput={(e) => handleInput(e)} type="search" name="" id="" placeholder="Pesquise filmes..." />
          <svg onClick={handleSearch} width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="search-icon">
            <circle cx="6.84448" cy="6.84448" r="5.99243" stroke="white" stroke-width="1.00001" stroke-linecap="round" stroke-linejoin="round" />
            <path opacity="0.4" d="M11.0122 11.3232L13.3616 13.6665" stroke="white" stroke-width="1.00001" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div className="fav">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.6648 18.6314L5.73346 21.8808C5.25989 22.1269 4.67646 21.9527 4.41538 21.4872V21.4872C4.33985 21.343 4.2991 21.1832 4.29639 21.0204V6.62223C4.29639 3.87623 6.17282 2.77783 8.87305 2.77783H15.2163C17.8341 2.77783 19.793 3.803 19.793 6.43916V21.0204C19.793 21.2801 19.6898 21.5293 19.5061 21.7129C19.3224 21.8966 19.0733 21.9998 18.8135 21.9998C18.6479 21.9972 18.485 21.9565 18.3376 21.8808L12.3696 18.6314C12.1497 18.5126 11.8847 18.5126 11.6648 18.6314Z" stroke="#FDFDFD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path opacity="0.4" d="M8.36963 9.32241H15.6648" stroke="#FDFDFD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <a href="#">Favoritos</a>
        </div>
        <div className="promo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.79413 7.05575C4.79413 5.80675 5.80713 4.79375 7.05513 4.79375H8.08413C8.68013 4.79375 9.25313 4.55775 9.67713 4.13675L10.3961 3.41675C11.2771 2.53175 12.7091 2.52775 13.5941 3.40875L13.6031 3.41675L14.3231 4.13675C14.7461 4.55775 15.3191 4.79375 15.9161 4.79375H16.9441C18.1931 4.79375 19.2061 5.80675 19.2061 7.05575V8.08275C19.2061 8.68075 19.4421 9.25275 19.8631 9.67675L20.5831 10.3967C21.4681 11.2777 21.4731 12.7087 20.5921 13.5947L20.5831 13.6037L19.8631 14.3237C19.4421 14.7457 19.2061 15.3197 19.2061 15.9157V16.9447C19.2061 18.1937 18.1931 19.2057 16.9441 19.2057H15.9161C15.3191 19.2057 14.7461 19.4427 14.3231 19.8637L13.6031 20.5827C12.7231 21.4687 11.2911 21.4727 10.4051 20.5917C10.4021 20.5887 10.3991 20.5857 10.3961 20.5827L9.67713 19.8637C9.25313 19.4427 8.68013 19.2057 8.08413 19.2057H7.05513C5.80713 19.2057 4.79413 18.1937 4.79413 16.9447V15.9157C4.79413 15.3197 4.55713 14.7457 4.13613 14.3237L3.41713 13.6037C2.53113 12.7227 2.52713 11.2907 3.40813 10.4057L3.41713 10.3967L4.13613 9.67675C4.55713 9.25275 4.79413 8.68075 4.79413 8.08275V7.05575" stroke="#FDFDFD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path opacity="0.4" d="M9.42969 14.5697L14.5697 9.42969" stroke="#FDFDFD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path opacity="0.4" d="M14.5664 15.3225C14.3664 15.3225 14.1764 15.2425 14.0364 15.1025C13.9664 15.0325 13.9164 14.9425 13.8764 14.8525C13.8364 14.7625 13.8164 14.6735 13.8164 14.5725C13.8164 14.4725 13.8364 14.3725 13.8764 14.2825C13.9164 14.1925 13.9664 14.1125 14.0364 14.0425C14.3164 13.7625 14.8164 13.7625 15.0964 14.0425C15.1664 14.1125 15.2264 14.1925 15.2664 14.2825C15.2964 14.3725 15.3164 14.4725 15.3164 14.5725C15.3164 14.6735 15.2964 14.7625 15.2664 14.8525C15.2264 14.9425 15.1664 15.0325 15.0964 15.1025C14.9564 15.2425 14.7664 15.3225 14.5664 15.3225Z" fill="#FDFDFD" />
            <path opacity="0.4" d="M9.42627 10.1826C9.32627 10.1826 9.23627 10.1616 9.14627 10.1216C9.05627 10.0816 8.96627 10.0326 8.89627 9.96264C8.82627 9.88264 8.77627 9.80264 8.73627 9.71264C8.69627 9.62164 8.67627 9.53264 8.67627 9.43264C8.67627 9.33164 8.69627 9.23264 8.73627 9.14264C8.77627 9.05264 8.82627 8.96264 8.89627 8.90264C9.18627 8.62164 9.67627 8.62164 9.95627 8.90264C10.0963 9.04164 10.1763 9.23264 10.1763 9.43264C10.1763 9.53264 10.1663 9.62164 10.1263 9.71264C10.0863 9.80264 10.0263 9.88264 9.95627 9.96264C9.88627 10.0326 9.80627 10.0816 9.71627 10.1216C9.62627 10.1616 9.52627 10.1826 9.42627 10.1826Z" fill="#FDFDFD" />
          </svg>
          <a href="#">Promoções</a>
        </div>
        <div className="profile">
          Bem vindo, Dina
          <img src={profile} alt="Profile" className="profile-img"></img>
        </div>
      </header>

      <main>
        <div className={banner} onClick={esconderBanner}>
          <div className="cupom">
            <h1>APROVEITE AGORA</h1>
            <div className="container-cupom">
              <svg width="40" height="37" viewBox="0 0 40 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d)">
                  <circle cx="23.5" cy="20" r="16" fill="url(#paint0_linear)" />
                </g>
                <path opacity="0.4" d="M24.8451 14.3638V16.1238" stroke="white" stroke-width="1.09091" stroke-linecap="round" stroke-linejoin="round" />
                <path opacity="0.4" d="M24.8451 24.189V25.661" stroke="white" stroke-width="1.09091" stroke-linecap="round" stroke-linejoin="round" />
                <path opacity="0.4" d="M24.8451 21.6908V18.1846" stroke="white" stroke-width="1.09091" stroke-linecap="round" stroke-linejoin="round" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M28.3741 25.818C29.6992 25.818 30.7725 24.758 30.7725 23.4494V21.5639C29.8957 21.5639 29.1895 20.8665 29.1895 20.0006C29.1895 19.1346 29.8957 18.4365 30.7725 18.4365L30.7717 16.5503C30.7717 15.2416 29.6977 14.1816 28.3733 14.1816H18.6263C17.3019 14.1816 16.2278 15.2416 16.2278 16.5503L16.2271 18.4979C17.1039 18.4979 17.8101 19.1346 17.8101 20.0006C17.8101 20.8665 17.1039 21.5639 16.2271 21.5639V23.4494C16.2271 24.758 17.3004 25.818 18.6255 25.818H28.3741Z" stroke="white" stroke-width="1.09091" stroke-linecap="round" stroke-linejoin="round" />
                <defs>
                  <filter id="filter0_d" x="0.227273" y="0.363637" width="46.5455" height="46.5455" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feMorphology radius="1.45455" operator="erode" in="SourceAlpha" result="effect1_dropShadow" />
                    <feOffset dy="3.63636" />
                    <feGaussianBlur stdDeviation="4.36364" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.973987 0 0 0 0 0.676463 0 0 0 0 0.89068 0 0 0 0.2 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                  </filter>
                  <linearGradient id="paint0_linear" x1="15.5" y1="33.4545" x2="39.5" y2="11.6364" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#EE82D0" />
                    <stop offset="0.685857" stop-color="#F8ACE3" />
                    <stop offset="1" stop-color="#FFC8F0" />
                  </linearGradient>
                </defs>
              </svg>
              <p>CUPOM: HTMLNAOELINGUAGEM</p>
            </div>
          </div>
          <div className="cronometro">
            <h2>FINALIZA EM:</h2>
            <div className="container-cronometro">
              <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16.5" cy="16" r="16" fill="url(#paint1_linear)" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M19.6522 9.27246H13.3475C11.1504 9.27246 9.77295 10.8281 9.77295 13.0296V18.9699C9.77295 21.1714 11.1431 22.727 13.3475 22.727H19.6515C21.8559 22.727 23.2275 21.1714 23.2275 18.9699V13.0296C23.2275 10.8281 21.8559 9.27246 19.6522 9.27246Z" stroke="#200E32" stroke-width="1.09091" stroke-linecap="round" stroke-linejoin="round" />
                <path opacity="0.4" d="M18.9662 17.4671L16.5 15.9959V12.8242" stroke="#200E32" stroke-width="1.09091" stroke-linecap="round" stroke-linejoin="round" />
                <defs>
                  <linearGradient id="paint1_linear" x1="36.5" y1="-1.81818" x2="-6.40909" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#E5DBFB" />
                    <stop offset="1" stop-color="#B395F3" />
                  </linearGradient>
                </defs>
              </svg>
              <p>00:04:52</p>
            </div>
          </div>
          <img src={money} alt="Money" />
        </div>
        <div className="top-filmes">
          <h2>Top Filmes</h2>
          <div className="filmes-topfilmes">
            <TopFilmes />
          </div>
        </div>
        <div className="todos-filmes">
          <h2>Filmes</h2>
          <Filtros />
          <div className="filmes">
            <Filmes />
          </div>
        </div>
      </main>

      <aside>
        <div className="sacola">
          <div className="label">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M20.7348 35.8354L11.0955 30.2701C7.55479 28.2259 5.57683 25.3787 9.32017 20.6769L14.246 14.2198C16.2045 11.9261 18.4102 11.889 19.8477 12.7189L31.6008 19.5046C33.0593 20.3467 33.9922 22.2945 33.1017 25.1062L29.9727 32.6006C27.9918 37.5449 24.2755 37.8796 20.7348 35.8354Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path opacity="0.4" d="M30.8278 18.72C32.4185 15.9648 31.4745 12.4417 28.7193 10.851V10.851C27.3958 10.0794 25.8194 9.86674 24.3388 10.2601C22.8582 10.6535 21.5952 11.6205 20.8292 12.9473V12.9473" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M26.261 23.0168L26.2082 22.9863" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M19.5286 19.1296L19.4757 19.0991" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <h1>Sacola</h1>
          </div>
          <Sacola />
        </div>
      </aside>
    </div>
  );
}

export default App;
