import Count from "@/components/common/Count"

const stats = [
   {
      number: 500,
      suffix: "+",
      label: "Propiedades",
      purple: false,
   },
   {
      number: 15,
      suffix: "",
      label: "Años de Experiencia",
      purple: true,
   },
   {
      number: 98,
      suffix: "%",
      label: "Clientes Satisfechos",
      purple: false,
   },
   {
      number: 2,
      suffix: "B+",
      label: "MXN en Transacciones",
      purple: false,
   },
]

const StatsBar = () => {
   return (
      <div className="nubia-stats">
         <div className="container">
            <div className="stats-grid">
               {stats.map((stat, i) => (
                  <div key={i} className="stat-item">
                     <span className={`stat-number${stat.purple ? " purple" : ""}`}>
                        <Count number={stat.number} />
                        {stat.suffix}
                     </span>
                     <span className="stat-label">{stat.label}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}

export default StatsBar
