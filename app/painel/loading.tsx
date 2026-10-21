/** Enquanto a página do painel carrega: blocos com a forma do conteúdo, em vez de um ecrã vazio. */
export default function Carregando() {
  return (
    <div aria-busy="true" aria-label="A carregar" className="space-y-6">
      <div className="esqueleto h-9 w-64" />
      <div className="esqueleto h-4 w-40" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="esqueleto h-28" />
        ))}
      </div>
      <div className="esqueleto h-64" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="esqueleto h-56" />
        <div className="esqueleto h-56" />
      </div>
    </div>
  );
}
